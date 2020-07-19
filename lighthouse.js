// Require dependencies
const lighthouse = require('lighthouse')
const puppeteer = require('puppeteer')
const {argv} = require('yargs')
const {errorAndExit, writeTestResultsToFile} = require('./util')

// Define some configuration which will tell lighthouse what to do
const lighthouseOptions = {
  output: 'html', // We want output in html
  onlyCategories: ['accessibility'], // We only want the accessibility audit (not performance etc.)
  outputPath: `./lighthouse.html`
};

const main = async () => {
  // If no URL defined, then exit!
  if (!argv.url) {
    errorAndExit("No URL flag passed, exiting")
  }

  // If no output path for the HTML report, then exit!
  if (!lighthouseOptions['outputPath']) {
    errorAndExit("No HTML output path, exiting")
  }

  const browser = await puppeteer.launch({headless: true}); // Launch headless puppeteer instance
  const page = await browser.newPage(); // Open a new page
  await page.goto(argv.url); // Go to the passed URL
  const port =  new URL(browser.wsEndpoint()).port; // Get the port that puppeteer is running on
  const results = await lighthouse(argv.url, {...lighthouseOptions, port})// Run lighthouse against the port puppeteer is running on, with the options defined
  await writeTestResultsToFile(lighthouseOptions['outputPath'], results.report);
  await browser.close(); // Close the browser
}

// We want need to define a self-calling function to get a top level synchronous loop, so our code runs in order
(async () => {
  try {
    await main()
  } catch (e) {
    errorAndExit(e.message)
  }
})();

