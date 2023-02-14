# Clear Cache

Clears the drupal and varnish caches on the configured ACSF environment.

## Usage

`node .`

There are no command line options; cache is cleared on the ACSF environment specified in the configuration file.  This may be overridden by setting the `NODE_CONFIG` environment variable, e.g.

```bash
export NODE_CONFIG="{ \"factoryConnection\": { \"username\": \"${USERNAME}\", \"apikey\": \"${ACSF_API_KEY}\", \"factoryHost\": \"${FACTORY_HOST}\" } }"
```

## Configuration

Configuration files are stored in the `config` directory.  Do not alter the contents of `default.json`, instead, copy its contents to `local.json` (this file is explicitly excluded from version control).

The format of the configuration file is:

```json
{
  "factoryConnection": {
    "username": "nobody",
    "apikey": "11111111",
    "factoryHost": "www.site.acsitefactory.com"
  }
}
```

Under the `factoryConnection` key:
- `username` - your ACSF username (`username@nih.gov`).
- `apikey` - your ACSF API key (obtain this from "Account Settings" on ACSF).
- `factoryHost` - the ACSF environment you will be backing up.
