import webdriverio from 'webdriverio';

let client;

process.on('beforeExit', () => {
  if (client) {
    client.end();
  }
});

export default async function createSeleniumBrowser() {
  if (!client) {
    client = webdriverio.remote({
      desiredCapabilities: {
        browserName: 'chrome',
      },
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      waitforTimeout: Number(process.env.WAIT_FOR_TIMEOUT || '5000'),
    });

    await client.init();
  }

  return () => client;
}
