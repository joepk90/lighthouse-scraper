const { generateReport } = require('./generate-report.js');
const { generateLighthouseReports } = require('./lighthouse-scraper.js');

// TODO fix async logic. generateReport finished before generateLighthouseReports
(async () => {
    await generateLighthouseReports()
    await generateReport()
})();
