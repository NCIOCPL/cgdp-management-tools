const config                    = require('config');
const asyncPool                 = require('tiny-async-pool');

const SiteFactoryClient         = require('@nciocpl/site-factory-client');

const factoryConn = config.get('factoryConnection');

// Site factory client.
const sfClient = new SiteFactoryClient({
    username: factoryConn.username,
    apikey: factoryConn.apikey,
    factoryHost: factoryConn.factoryHost
});

async function main() {
    try {
        const sitelist = await sfClient.sites.list(); // List of ACSF sites

        const siteIds = sitelist.map((site) => site.id);

        // Clear the varnish and drupal caches
        const clearCache = id => sfClient.sites.clearCache(id);
        await asyncPool(5, siteIds, clearCache);

        console.log(`Caches are being cleared on '${factoryConn.factoryHost}'.`);

    } catch (err) {
        console.error(err);
    }
}

main();
