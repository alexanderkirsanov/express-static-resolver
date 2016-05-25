const assert = require('chai').assert;
const simple = require('simple-mock');
const resolverCreator = require('./index');

describe('Resolver basic tests', () => {
    describe('modern browsers tests', () => {
        const config = {modernPath: null, oldPath: null};
        const modern = simple.mock(config, 'modernPath').callFn(() => {
        });
        const old = simple.mock(config, 'oldPath').callFn(() => {
        });
        const resolver = resolverCreator(config);
        beforeEach(()=> {
            modern.reset();
            old.reset();
        });
        it('should invoke modern path in case of modern browsers', () => {
            const modernBrowserReq = {
                query: {},
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36'
                }
            };
            resolver(modernBrowserReq);
            assert.equal(modern.callCount, 1);
            assert.equal(old.callCount, 0);
        });
        it('should invoke old path in case of old browsers', () => {

            const modernBrowserReq = {
                query: {},
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko'
                }
            };
            resolver(modernBrowserReq);
            assert.equal(modern.callCount, 0);
            assert.equal(old.callCount, 1);
        });
        it('should invoke old path in case of new browser and old query param', () => {

            const modernBrowserReq = {
                query: {
                    browser: 'old'
                },
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36'
                }
            };
            resolver(modernBrowserReq);
            assert.equal(modern.callCount, 0);
            assert.equal(old.callCount, 1);
        });
        it('should invoke modern path in case of old browser and new query param', () => {

            const modernBrowserReq = {
                query: {
                    browser: 'modern'
                },
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko'
                }
            };
            resolver(modernBrowserReq);
            assert.equal(modern.callCount, 1);
            assert.equal(old.callCount, 0);
        });
    });
});
