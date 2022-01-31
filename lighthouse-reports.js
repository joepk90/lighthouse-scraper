// yarn add --dev lighthouse cross-env
// in package.json: 
// scripts: { "lighthouse-dev": "cross-env NODE_ENV=development node ./lighthouse.js",
//  "lighthouse-prod": "cross-env NODE_ENV=production CHROME_FLAGS=--headless node ./lighthouse.js" }

const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')
const mode = process.env.NODE_ENV
const chromeFlags = '--headless'
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
    const options = {
      chromeFlags
    }

    chromeLauncher.launch({ chromeFlags: options.chromeFlags }).then(chrome => {
      options.port = chrome.port

      lighthouse(page, options, )
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

function writeResults (page, results) {
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory)
  }

  const htmlReport = ReportGenerator.generateReport(results, 'html')
  const resultsPath = getReportFilePath(outputDirectory, page.name)
  return fs.writeFile(resultsPath, htmlReport, function (err) {
    if (err) {
      return console.log(err)
    }
    console.log(`The report for "${page.name}" was saved at ${resultsPath}`)
  })
}

function getReportFilePath (outputDirectory, pageName) {
  const now = new Date()
  return `${outputDirectory}/${pageName}-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-${now.getMilliseconds()}.html`
}


exports.lighthouseReportGenerator = lighthouseReportGenerator;