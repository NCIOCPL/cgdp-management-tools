const config                    = require('config');
const SiteFactoryClient         = require('@nciocpl/site-factory-client');


async function main() {

    const factoryConn = config.get('factoryConnection');
    const client = new SiteFactoryClient({
        username: factoryConn.username,
        apikey: factoryConn.apikey,
        factoryHost: factoryConn.factoryHost
    });

    const siteList = await client.sites.list();

    const requiredSites = config.requiredSites.map(site => site.toLowerCase().trim());
    const sites = siteList.map(entry => {
        let val = entry.site;
        if (requiredSites.includes(val))
            val += ':disabled:selected';
        return val;
    })
    .sort();

    const list = 'return ' + JSON.stringify(sites, null, 1).replaceAll("\"","\'");

    console.log(list)
}
main();