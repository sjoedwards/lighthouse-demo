const fs = require('fs').promises;

// Helper function for exiting on error
const errorAndExit = message => {
  console.error(message);
  process.exit(1)
}

// Helper function for writing to a file
const writeTestResultsToFile = async (filepath, results) => {
  await fs.writeFile(filepath, results, { mode: '777' }, error => {
    if (error) {
      errorAndExit("Error creating report file")
    }
    console.log(`Test results have been written to ${path.resolve(filepath)}`);
  });
};

module.exports = {errorAndExit, writeTestResultsToFile}