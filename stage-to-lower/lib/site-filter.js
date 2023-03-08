'use strict'

module.exports.BAD_FILTER_TYPE = 'filter must be a string or an array of strings';

/**
 * Filters a site list to only specific names.
 *
 * @param {Object[]} siteList An array of site information objects from the sites.list method.
 * @param {*} filter A list of site names to include. Either an array of strings, or single string of comma-separated values.
 */
module.exports.filterSiteList = function(siteList, filter) {
    if(filter) {

        if(filter.constructor === String)
            filter = filter.split(',');
        // deliberately not an else.
        if(filter.constructor === Array) {
            if (!filter.every(x => x.constructor === String))
                throw new Error(this.BAD_FILTER_TYPE);
            filter = filter.map(x => x.trim());
        }
        else
            throw new Error(this.BAD_FILTER_TYPE);

        return siteList.filter(entry => filter.includes(entry.site));
    }
    else
        return siteList;
}
