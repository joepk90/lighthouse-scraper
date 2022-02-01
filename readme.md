# Lighthouse Scraper
Example project setup to scrape a sitemap, generate lighthouse reports, then aggregate the webpages resource summary data (amount of css, js, media etc) and output a CSV.

To start the Lighthouse report generation run the following command, providing your websites sitemap url.
```sh
npm run report --url="https://www.domain.com/sitemap.xml"
```

Currently this project is not setup to manage generated reports well. Generated Lighthouse json reports will never be deleted, where there is only one generated csv reports - running an update will overwrite the previous CSV report. It will also include ALL the JSON files output by Lighthouse. This will mean there could well be duplicates if your previous json reports were not deleted first.

Recommendation: delete all JSON (/reports) and CSV (/csv-reports) files before starting a new audit.

### To Do
- Resolve async issue when running both lighthouse report generation and generating the csv (see index.js) 
- Optimisations