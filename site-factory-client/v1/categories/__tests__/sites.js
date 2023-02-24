const SFSites           = require('../sites');

describe('SFSites', () => {

    describe('createSite', () => {

        it('makes a POST request', async () => {

            const result = Object.freeze({
                id: 123,
                site: 'a-new-site',
                domains: ['a-new-site.example.com'],
                task_id: 456
            });
            const expectedBody = {site_name: 'test-value'}

            const mockClient = {
                post: jest.fn((siteName) => result)
            };
            const sites = new SFSites(mockClient);

            const actual = await sites.createSite('test-value');

            expect(mockClient.post.mock.calls).toHaveLength(1);
            expect(mockClient.post.mock.calls[0]).toHaveLength(2);
            expect(mockClient.post.mock.calls[0][0]).toBe('/sites');
            expect(mockClient.post.mock.calls[0][1]).toStrictEqual(expectedBody);
            expect(actual).toBe(result);
        });

        it('passes a single group ID', async () => {

            const result = Object.freeze({
                id: 123,
                site: 'a-new-site',
                domains: ['a-new-site.example.com'],
                task_id: 456
            });
            const expectedBody = { site_name: 'test-value', group_ids: [456] }

            const mockClient = {
                post: jest.fn((siteName) => result)
            };
            const sites = new SFSites(mockClient);

            const actual = await sites.createSite('test-value', 456);

            expect(mockClient.post.mock.calls).toHaveLength(1);
            expect(mockClient.post.mock.calls[0]).toHaveLength(2);
            expect(mockClient.post.mock.calls[0][0]).toBe('/sites');
            expect(mockClient.post.mock.calls[0][1]).toStrictEqual(expectedBody);
            expect(actual).toBe(result);
        });

        it('passes an array of group IDs', async () => {

            const result = Object.freeze({
                id: 123,
                site: 'a-new-site',
                domains: ['a-new-site.example.com'],
                task_id: 456
            });
            const expectedBody = { site_name: 'test-value', group_ids: [456, 789] }

            const mockClient = {
                post: jest.fn((siteName) => result)
            };
            const sites = new SFSites(mockClient);

            const actual = await sites.createSite('test-value', [456, 789]);

            expect(mockClient.post.mock.calls).toHaveLength(1);
            expect(mockClient.post.mock.calls[0]).toHaveLength(2);
            expect(mockClient.post.mock.calls[0][0]).toBe('/sites');
            expect(mockClient.post.mock.calls[0][1]).toStrictEqual(expectedBody);
            expect(actual).toBe(result);
        });

        it('throws an error on non-numeric group IDs', async () => {

            const mockClient = {};
            const sites = new SFSites(mockClient);

            expect.assertions(1);

            await expect(sites.createSite('test-value', '23'))
                .rejects
                .toEqual( Error('groupIDs must be numeric.'))

        });

        it('throws an error on mixed group ID types', async () => {

            const mockClient = {};
            const sites = new SFSites(mockClient);

            expect.assertions(1);

            await expect(sites.createSite('test-value', [12, '23']))
                .rejects
                .toEqual(Error('groupIDs must be numeric.'))

        });

    });

});
