const fs = require('fs');
const { sitemapUrlScraper } = require("xml-sitemap-url-scraper");
const { exec } = require('child_process');
const { lighthouseReportGenerator } = require('./lighthouse-reports');

const scraper = async (sitemapUrls) => {

    // Define how many compressed sitemaps we want to decompress and process at once (if any are found)
    let concurrency = 5;

    // Function's concurrency defaults to 1 if no param is provided
    let urls = await sitemapUrlScraper(sitemapUrls, concurrency);

    return urls;

}


(async () => {

    const scrapedUrls = await scraper(["https://www.example.com/sitemap.xml"])

    const urls = [scrapedUrls[0], scrapedUrls[1]];

    lighthouseReportGenerator(urls)

})()

