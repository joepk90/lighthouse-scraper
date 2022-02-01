const { generateReport } = require('./generate-report.js');
const { generateLighthouseReports } = require('./lighthouse-scraper.js');

// npm run report --url="https://www.domain.com/sitemap.xml"
const siteMapUrl = process.env.npm_config_url;

// TODO fix async logic. generateReport finished before generateLighthouseReports
// for now, first run generateLighthouseReports, then generateReport
(async () => {
    if (siteMapUrl) {
        await generateLighthouseReports(siteMapUrl)
        await generateReport()
    }
    
})();
