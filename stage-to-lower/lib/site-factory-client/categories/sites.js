'use strict'

const SFCategoryBase        = require('../category-base');

/**
 * Site API Calls
 */
class SFSites extends SFCategoryBase {

  /**
   * Creates a new instance of SFSites
   *
   * @param {SFRequest} client A SFRequest client.
   * @param {object} config Configuration options.
   * @param {number} config.pageRequestLimit How many items to request from api at a time (DEFAULT: 100 - the max)
   */
  constructor(client, {
    pageRequestLimit = 100
  } = { }) {
    super(client);

    // This is here for 2 reasons:
    // 1. If the API changes, we can more easily change it through configs.
    // 2. For unit testing, we can set it to a lower amount to mock the reqs.
    // NOTE: Acquia has a limit of 100 for paged requests.
    this.pageRequestLimit = pageRequestLimit;
  }

  /**
   * Lists the sites in the factory.
   */
  async list() {
    return this._list(1);
  }

  /**
   * Internal method to make the raw paginated list requests.
   *
   * @param {number} page Page of results to return (DEFAULT: 1)
   */
  async _list(page = 1) {

    const sitesResponse = await this.client.get('/sites', {
      limit: this.pageRequestLimit, // 100 is the max number of sites.
      page
    });

    // There are no sites at all, exit quickly.
    if (sitesResponse.count == 0) {
      return [];
    }

    // If there are more to fetch, then go fetch them.
    if (sitesResponse.count > (page * this.pageRequestLimit)) {
      return sitesResponse.sites.concat(
        await this._list(page + 1)
      );
    } else {
      return sitesResponse.sites;
    }

  }

  /**
   * Gets the details of a site.
   *
   * @param {*} siteID
   */
  async get(siteID) {
    //TODO: Check if number.

    return this.client.get('/sites/' + siteID);
  }

  /**
   *
   * @param {number} siteID
   * @param {string} label Human-readable label for the backup.
   */
  async createBackup(siteID, label) {
    return this.client.post(`/sites/${siteID}/backup`, {
      "label": label
    });
  }

  /**
   * Create a new site.
   *
   * @param {*} siteName The new site's name.
   * @param {Number[]} a list of ids for groups the site should be
   *  part of.  Optional. (Allegedly)
   * @returns A data structure with the new site's metadata and
   * task ID for creating it.
   *  {
   *    "id": 191,
   *    "site": "site1",
   *    "domains": [
   *      "mysite.site-factory.com"
   *    ],
   *    "task_id": 12345
   *  }
   */
  async createSite(siteName, groupIDs) {

    const body = {
      "site_name": siteName
    }

    if(groupIDs){
      if( groupIDs.constructor === Array && groupIDs.every( value => value.constructor === Number))
        body["group_ids"] = groupIDs;
      else if( groupIDs.constructor === Number)
        body["group_ids"] = [groupIDs];
      else
        throw new Error('groupIDs must be numeric.');
    }

    return this.client.post(`/sites`, body);
  }

  /**
   * Gets the backups for a site.
   *
   * @param {*} siteID
   * @param {object} param.limit Sites to return (DEFAULT: 100, Max 100)
   * @param {object} param.page Page of results to return (DEFAULT: 1)
   */
  async getBackups(siteID, {
    limit = 100,
    page = 1
  } = { }) {

    // Loop through backup requests and return single array.

    return this.client.get('/sites/' + siteID + '/backups',{
      limit,
      page
    });
  }

  /**
   * Clear the Drupal and Varnish caches for a site.
   *
   * @param {*} siteID The ID of the specific site to be cleared.
   * @returns a data structure containing the IDs for the associated tasks:
   *    {
   *      "id" : 123,
   *      "time" : "2017-05-04T09:25:26+00:00",
   *      "task_ids": {
   *        "drupal_cache_clear" : 1234,
   *        "varnish_cache_clear" : 1234
   *      }
   *    }
   */
  async clearCache(siteID) {
    return this.client.post('/sites/' + siteID + '/cache-clear');
  }
}

module.exports = SFSites;
