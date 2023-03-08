# Get Site List

Retrieve a list of Site Factory sites.

---

Retrieves a list of sites in an Acquia Site Factory instance in a format suitable for use as a groovy script in the Jenkins "Active Choices Parameter" plugin.  (Basically, this is a lazy way of getting all the sites and avoiding typos.)

## Configuration

Configuration files are stored in the `config` directory.  Do not alter the contents of `default.json`, instead, copy its contents to `local.json` (this file is explicitly excluded from version control).

The format of the configuration file is:

```json
{
  "factoryConnection": {
    "username": "nobody",
    "apikey": "11111111",
    "factoryHost": "www.site.acsitefactory.com"
  },
  "requiredSites": [
    "sitename-1",
    "sitename-2",
    "sitename-3",
  ]
}
```

Under the `factoryConnection` key:
- `username` - your ACSF username (`username@nih.gov`).
- `apikey` - your ACSF API key (obtain this from "Account Settings" on ACSF).
- `factoryHost` - the ACSF environment you will be backing up.

The `requiredSites` key contains an array of ACSF site names. These are the sites which are required to be staged every time. The site name is as it appears in the Site Factory UI.  (e.g. sitename instead of sitename.site.acsitefactory.com)