// based off the following snippet:
// https://gist.github.com/mort3za/e959d806a8635a914bcc76c2895014ef

const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')
const mode = process.env.NODE_ENV
const outputFormat = 'json';
const outputDirectory = './reports'
const ReportGenerator = require('lighthouse/report/generator/report-generator')

function lighthouseReportGenerator (sitePages) {

  asyncForEach(sitePages, async page => {
    try {
      await launchChromeAndRunLighthouse(page).then(results => {
        writeResults(page, results)
      })
    } catch (error) {
      console.log(error)
    }
  });
}

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function launchChromeAndRunLighthouse (page) {

  return new Promise((resolve, reject) => {

    chromeLauncher.launch({chromeFlags: ['--headless']}).then(chrome => {
      const options = {output: outputFormat, onlyCategories: ['performance'], port: chrome.port};

      lighthouse(page, options)
        .then(results => {
          chrome.kill().then(resolve(results.lhr))
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  })
}

function convertUrl(page) {

    newName = page.replace('http://', '');
    newName = newName.replace('https://', '');
    newName = newName.replace(/\//g, '-');
    return newName;
}

function writeResults (page, results) {
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory)
  }

  const fileName = convertUrl(page)
  const htmlReport = ReportGenerator.generateReport(results, outputFormat)
  const resultsPath = getReportFilePath(outputDirectory, fileName)
  return fs.writeFile(resultsPath, htmlReport, function (err) {
    if (err) {
      return console.log(err)
    }
    console.log(`The report for "${fileName}" was saved at ${resultsPath}`)
  })
}

function getReportFilePath (outputDirectory, fileName) {
  const now = new Date()
  return `${outputDirectory}/${fileName}-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-${now.getMilliseconds()}.${outputFormat}`
}


exports.lighthouseReportGenerator = lighthouseReportGenerator;