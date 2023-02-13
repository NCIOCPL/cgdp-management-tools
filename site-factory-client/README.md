# Site Factory Client

Client library for managing an Acquia Site Factory instance.

Install via

```
npm install --save @nciocpl/site-factory-client
```

## Usage

```javascript
const SiteFactoryClient         = require('@nciocpl/site-factory-client');

// Client for v1 of the site factory API.
const sfClient = new SiteFactoryClient({
    username: "SOME_USER",
    apikey: "APIKEY_FROM_ACCOUNT_SETTINGS",
    factoryHost: "www.sitefactoryhostname.com"
});
```

**Note:** Most functionality comes from v1. Version 2 of the API provides no functionality beyond staging production to a lower tier.  To access the v2 client requires using the package's `.v2` property.  The constructors are identical.

example:

```javascript
const SiteFactoryClient2         = require('@nciocpl/site-factory-client').v2;

// Client for v1 of the site factory API.
const sfClient2 = new SiteFactoryClient2({
    username: "SOME_USER",
    apikey: "APIKEY_FROM_ACCOUNT_SETTINGS",
    factoryHost: "www.sitefactoryhostname.com"
});
```