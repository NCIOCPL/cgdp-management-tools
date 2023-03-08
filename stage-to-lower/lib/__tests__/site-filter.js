const SiteFilter                = require('./lib/site-filter');

const SITE_LIST = [
        {
            "id": 1,
            "created": 1561786544,
            "owner": "nobody",
            "db_name": "dbname1",
            "site": "site1",
            "stack_id": 1,
            "domain": "site1.site-factory.com",
            "groups": [1],
            "site_collection": false,
            "is_primary": true
        },
        {
            "id": 2,
            "created": 1561786652,
            "owner": "nobody",
            "db_name": "dbname2",
            "site": "site2",
            "stack_id": 1,
            "domain": "site2.site-factory.com",
            "groups": [1],
            "site_collection": false,
            "is_primary": true
        },
        {
            "id": 3,
            "created": 1561786783,
            "owner": "nobody",
            "db_name": "dbname3",
            "site": "site3",
            "stack_id": 1,
            "domain": "site3.site-factory.com",
            "groups": [1],
            "site_collection": false,
            "is_primary": true
        }
    ];


describe('filterSiteList', () => {

    it('includes all for a null filter', () => {
        const actual = SiteFilter.filterSiteList(SITE_LIST, null);
        expect(actual).toBe(SITE_LIST);
    });


    it('throws on non-string/array filter', () => {
        expect(() => SiteFilter.filterSiteList(SITE_LIST, true))
            .toThrow(SiteFilter.BAD_FILTER_TYPE);
    })


    it('throws on non-string value in filter array', () => {
        expect(() => SiteFilter.filterSiteList(SITE_LIST, ['a', 5, 'b']))
            .toThrow(SiteFilter.BAD_FILTER_TYPE);
    });

    it('handles an array of sites', () => {

        const actual = SiteFilter.filterSiteList(SITE_LIST, ['site1', 'site3']);

        expect(actual.length).toBe(2);
        expect(actual[0].id).toBe(1);
        expect(actual[0].site).toBe('site1');
        expect(actual[1].id).toBe(3);
        expect(actual[1].site).toBe('site3');
    });

    it('handles a comma-separated list of sites', () => {

        const actual = SiteFilter.filterSiteList(SITE_LIST, 'site1,site3');

        expect(actual.length).toBe(2);
        expect(actual[0].id).toBe(1);
        expect(actual[0].site).toBe('site1');
        expect(actual[1].id).toBe(3);
        expect(actual[1].site).toBe('site3');
    });

    it('handles a list of sites with spaces', () => {

        const actual = SiteFilter.filterSiteList(SITE_LIST, 'site1, site3');

        expect(actual.length).toBe(2);
        expect(actual[0].id).toBe(1);
        expect(actual[0].site).toBe('site1');
        expect(actual[1].id).toBe(3);
        expect(actual[1].site).toBe('site3');
    });

})