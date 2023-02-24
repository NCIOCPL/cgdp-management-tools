'use strict'

const SFCategoryBase = require('../category-base');

/**
 * Groups API Calls
 */
class SFGroups extends SFCategoryBase {

    /**
     * Creates a new instance of SFGroups
     *
     * @param {SFRequest} client A SFRequest client.
     * @param {object} config Configuration options.
     * @param {number} config.pageRequestLimit How many items to request from api at a time (DEFAULT: 100 - the max)
     */
    constructor(client, {
        pageRequestLimit = 100
    } = {}) {
        super(client);

        // This is here for 2 reasons:
        // 1. If the API changes, we can more easily change it through configs.
        // 2. For unit testing, we can set it to a lower amount to mock the reqs.
        // NOTE: Acquia has a limit of 100 for paged requests.
        this.pageRequestLimit = pageRequestLimit;
    }

    /**
     * Creates a site factory group.
     *
     * @param {String} groupName The new group's name.
     * @param {Number} parentGroup The integer ID of the parent group.
     * @returns
     */
    async createGroup(groupName, parentGroup = null) {

        var body = { group_name: groupName }
        if(parentGroup)
            body.parent_id = parentGroup;

        return await this.client.post('/groups', body);
    }

    /**
     * Delete a site factory group.
     *
     * @param {*} groupID The group's integer ID.
     * @returns
     */
    async deleteGroup(groupID) {
        return await this.client.delete(`/groups/${groupID}`);
    }

}

module.exports = SFGroups;