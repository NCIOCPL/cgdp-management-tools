const SFRequest         = require('../request');
const nock              = require('nock');

const mockUser = 'someuser@somewhere';
const mockAPIKey = '1234567890abc';
const mockHost = 'www.site.acsitefactory.com';

// This should be the hostname for all interceptor scopes.
const nockHost = `https://${mockHost}`;

beforeAll(() => {
    nock.disableNetConnect();
})

describe('SFRequest', () => {

    describe('constructor', () => {

        it('constructs with required parameters', async () => {

            const actual = new SFRequest(null, mockUser, mockAPIKey, mockHost);

            expect(actual).not.toBeNull();
        });

        it('throws error on missing username', async () => {

            expect(() => {
                const actual = new SFRequest(null, null, mockAPIKey, mockHost);
            }).toThrow('Username is required.');
        });

        it('throws error on missing api key', async () => {

            expect(() => {
                const actual = new SFRequest(null, mockUser, null, mockHost);
            }).toThrow('Api key is required.');
        });

        it('throws error on missing factory host', async () => {

            expect(() => {
                const actual = new SFRequest(null, mockUser, mockAPIKey, null);
            }).toThrow('Site Factory host is required.');
        });

    });

    describe('delete', () => {

        it('passes a path without a body', async () => {

            const delPath = '/path';

            const scope = nock(nockHost)
                .delete('/api/v1/path')
                .reply(200, 'did-some-stuff');

            const client = new SFRequest(null, mockUser, mockAPIKey, mockHost);
            const result = await client.delete(delPath);

            expect(result).toBe('did-some-stuff');
        });

    });

});
