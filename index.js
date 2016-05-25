const UAParser = require('ua-parser-js');
const path = require('path');

const createResolver = (config) => (req, res, next) => {
    const modernVersions = config.modernVersions || {};
    const isModernBrowser = (browserName, browserVersion) => {
        switch (browserName) {
            case 'IE':
                return browserVersion >= (modernVersions['IE'] || 14);
            case 'Firefox':
                return browserVersion >= (modernVersions['Firefox'] || 48);
            case 'Chrome':
                return browserVersion >= (modernVersions['Chrome'] || 50);
            case 'Canary':
                return browserVersion >= (modernVersions['Canary'] || 52);
            case 'Safari':
                return browserVersion > (modernVersions['Safari'] || 9);
            case 'Opera':
                return browserVersion >= (modernVersions['Opera'] || 37);
            default:
                return false;
        }
    };
    const ua = req.headers['user-agent'];
    const parser = new UAParser().setUA(ua);
    const browserName = parser.getBrowser().name;
    const fullBrowserVersion = parser.getBrowser().version;
    const browserVersion = fullBrowserVersion.split(".", 1).toString();
    const browserVersionNumber = Number(browserVersion);
    const browser = req.query.browser;
    var isModern = isModernBrowser(browserName, browserVersionNumber);
    if (browser === 'old') {
        isModern = false
    } else if (browser === 'modern') {
        isModern = true;
    }
    if (isModern) {
        config.modernPath(req, res, next);
    } else {
        config.oldPath(req, res, next)
    }
};

module.exports = createResolver;