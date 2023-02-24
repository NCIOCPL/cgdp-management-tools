const SFGroups           = require('../groups');

describe('SFGroups', () => {

    describe('constructor', () => {

        it('constructs with default pageRequestLimit', async() => {

            const mockClient = Object.freeze({});

            const actual = new SFGroups(mockClient);

            expect(actual).not.toBeNull();
            expect(actual.client).not.toBeNull();
            expect(actual.pageRequestLimit = 100);
        });

        it('handles overridden pageRequestLimit', async () => {

            const mockClient = Object.freeze({});

            const actual = new SFGroups(mockClient, {pageRequestLimit: 5});

            expect(actual).not.toBeNull();
            expect(actual.client).not.toBeNull();
            expect(actual.pageRequestLimit = 5);
        });

    });

    describe('createGroup', () => {

        it('defaults to no parent group', async () => {

            const result = Object.freeze({ group_id: 123, group_name: "testgroup" });
            const expectedBody = { group_name: 'a-group-name'}

            const mockClient = {
                post: jest.fn( groupName => result )
            }
            const groups = new SFGroups(mockClient);

            const actual = await groups.createGroup('a-group-name');

            expect(mockClient.post.mock.calls).toHaveLength(1);
            expect(mockClient.post.mock.calls[0]).toHaveLength(2);
            expect(mockClient.post.mock.calls[0][0]).toBe('/groups');
            expect(mockClient.post.mock.calls[0][1]).toStrictEqual(expectedBody);
            expect(actual).toBe(result);
        });

        it('passes parent group id', async () => {

            const result = Object.freeze({ group_id: 123, group_name: "testgroup" });
            const expectedBody = { group_name: 'a-group-name', parent_id: 456 }

            const mockClient = {
                post: jest.fn( groupName => result )
            }
            const groups = new SFGroups(mockClient);

            const actual = await groups.createGroup('a-group-name', 456);

            expect(mockClient.post.mock.calls).toHaveLength(1);
            expect(mockClient.post.mock.calls[0]).toHaveLength(2); // single argument
            expect(mockClient.post.mock.calls[0][0]).toBe('/groups');
            expect(mockClient.post.mock.calls[0][1]).toStrictEqual(expectedBody);
            expect(actual).toBe(result);
        });


    });

    describe('deleteGroup', () => {

        it('passes a single group id', async () => {

            const result = Object.freeze({ time: "2023-02-24T16:54000:00", group_id: 123});

            const mockClient = {
                delete: jest.fn( group_id => result)
            }
            const groups = new SFGroups(mockClient);

            const actual = await groups.deleteGroup(456);

            expect(mockClient.delete.mock.calls).toHaveLength(1);
            expect(mockClient.delete.mock.calls[0]).toHaveLength(1); // single argument
            expect(mockClient.delete.mock.calls[0][0]).toBe('/groups/456');

            expect(actual).toBe(result);

        });

    });

});
