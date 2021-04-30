var NodeEnvironemnt = require('jest-environment-node')
var puppeteer = require('puppeteer')
class CustomEnvironment extends NodeEnvironemnt {
    constructor(config, context){
        super(config, context)
    }
    async setup(){
        await super.setup()

        this.global.browser = await puppeteer.launch({
            ignoreHTTPSErrors: true, // don't show the warnings for the self-signed certificate of the Solid server
            headless: true,
            // slowMo: 20,
        });
        this.global.context = await this.global.browser.createIncognitoBrowserContext();
        this.global.page = await this.global.context.newPage();

        this.global.resetBrowserContext = async () => {
            if (this.global.page) {
                await this.global.page.close();
            }
            this.global.page = null;

            if (this.global.context) {
                await this.global.context.close();
            }

            this.global.context = await this.global.browser.createIncognitoBrowserContext();
            this.global.page = await this.global.context.newPage();
        };
    }
    async teardown(){
        await this.global.browser.close()
        await super.teardown()
    }
}
module.exports = CustomEnvironment