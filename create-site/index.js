const config                    = require('config');
const { Command }               = require('commander');

const SiteFactoryClient         = require('@nciocpl/site-factory-client');


const factoryConn = config.get('factoryConnection');

async function main() {

    const program = new Command();

    program
        .name('create-site')
        .description('Create a site in ACSF')
        .argument('<acsf_name>', 'The site name as it appears in the ACSF console.')
        .argument('<domain>', 'The domain to associate with the site.')
        .option('-g, --site-group <name>', 'Override the default ACSF site group.', config.defaultGroupName);

    program.parse();

    const siteName = program.args[0];
    const domain = program.args[1];
    const options = program.opts();

    const sfClient = new SiteFactoryClient({
        username: factoryConn.username,
        apikey: factoryConn.apikey,
        factoryHost: factoryConn.factoryHost
    });


    const groupInfo = await sfClient.groups.createGroup(options.siteGroup);
    const groupID = parseInt(groupInfo.group_id);

    const creationInfo = await sfClient.sites.createSite(siteName, groupID);
    const taskID = creationInfo.task_id;
    const siteID = parseInt(creationInfo.id);

    // Create the site.
    await sfClient.tasks.waitForCompletion(taskID, showProgress);
    
    // There is no opportunity for concurrency as
    // site creation must complete before adding the domain.
    await sfClient.domains.add(siteID, domain);

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


main();

