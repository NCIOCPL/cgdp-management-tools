const config                    = require('config');
const asyncPool                 = require('tiny-async-pool');

const SiteFactoryClient         = require('./lib/site-factory-client');
const SiteFactoryClient2        = require('./lib/site-factory-client-2');
const DomainUtility             = require('./lib/domain-utility');
const SiteFilter                = require('./lib/site-filter');
const UserFilter                = require('./lib/user-filter');

const factoryConn = config.get('factoryConnection');

// Client for v1 of the site factory API.
const sourceClient = new SiteFactoryClient({
    username: factoryConn.username,
    apikey: factoryConn.apikey,
    factoryHost: factoryConn.factoryHost
});

// Client for v2 of the site factory API.
const sourceClient2 = new SiteFactoryClient2({
    username: factoryConn.username,
    apikey: factoryConn.apikey,
    factoryHost: factoryConn.factoryHost
});

async function main() {
    try {
        const targetEnv = getTargetEnvironment();
        if (targetEnv !== 'dev' && targetEnv !== 'test') {
            console.error('You must specify a staging target, either "DEV" or "TEST".');
            process.exit(1);
        }

        const srcSitelist = await sourceClient.sites.list(); // List of ACSF sites

        const filtered = SiteFilter.filterSiteList(srcSitelist, config.stageList);

        const siteIds = filtered.map((site) => site.id);

        // Stage to requested lower tier.
        let stageTask = await sourceClient2.stage.stage(targetEnv, siteIds, true, true, false);

        // Wait for staging to complete.
        await sourceClient.tasks.waitForCompletion(stageTask.task_id, showProgress);

        // Get client for target server.
        const targetServer = DomainUtility.SFToStagingTarget(factoryConn.factoryHost, targetEnv);
        const destClient = new SiteFactoryClient({
            username: factoryConn.username,
            apikey: factoryConn.apikey,
            factoryHost: targetServer
        });

        // Re-assign domains to the target.

        // Translate site domains from the source to match the target.
        const srcDomainList = await getDomainList(sourceClient, siteIds)
        const destDomainList = DomainUtility.GenerateDestinationDomains(srcDomainList, targetEnv);

        await doDomainAssignments(destClient, destDomainList);

        // Clear the varnish and drupal caches
        const clearCache = id => destClient.sites.clearCache(id);
        await asyncPool(5, siteIds, clearCache);


        // // Set tier-specific permissions..
        // let users = await destClient.users.list();
        // users = UserFilter(users, config.roles.promote, config.roles.remove);
        // const assign = async user => destClient.users.setRoles(user.uid, config.roles.desired);
        // await asyncPool(5, users, assign);

        console.log(`Done staging to '${targetEnv}' environment.`);

    } catch (err) {
        console.error(err);
    }
}

/**
 * Callback function for updating progress of the staging operation.
 *
 * @param {Boolean} isComplete Pass true if the operation has completed, false otherwise.
 */
function showProgress(isComplete) {
    process.stdout.write('.');
    if (isComplete) {
        process.stdout.write('\n');
    }
}

/**
 * Parse the command line to find out the name of the environment to stage.
 */
function getTargetEnvironment() {
    const rawArgs = process.argv;
    if (rawArgs.length > 2 && typeof (rawArgs[2]) === "string") {
        return rawArgs[2].toLowerCase();
    }
    else {
        return null;
    }
}

/**
 * Retrieve all the domain information objects for a list of site IDs.
 *
 * @param {SiteFactoryClient} sfClient Client connected to the staging origin server.
 * @param {Int32Array} siteIDList An array of the sites.
 */
async function getDomainList(sfClient, siteIDList) {
    const getDomains = async siteID => sfClient.domains.get(siteID);
    return asyncPool(5, siteIDList, getDomains);
}

/**
 * Perform the actual domain assignments.
 *
 * @param {SiteFactoryClient} sfClient Client connected to staging destination server.
 * @param {Array} assignments array of domain structures.
 */
async function doDomainAssignments(sfClient, assignments) {

    /**
     *  Note: Individual entries in the assignments array have the structure
     *      {
     *          siteID: 123,
     *          primary: 'site1-test-acsf.example.com',
     *          secondary: [
     *              "site1-cms-test.example.com"
     *          ]
     *      }
     */
    const perSite = async siteInfo => {
        // The primary domain _must_ be set before the secondaries.
        await sfClient.domains.add(siteInfo.siteID, siteInfo.primary);
        await Promise.all(
            siteInfo.secondary.map(siteAlias => {
                sfClient.domains.add(siteInfo.siteID, siteAlias);
            })
        );
    };
    return asyncPool(5, assignments, perSite);
}

main();
