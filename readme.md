# Lighthouse Scraper
Example project setup to scrape a sitemap, generate lighthouse reports, then aggregate the webpages resource summary data (amount of css, js, media etc) and output a CSV.

To start the Lighthouse report generation run the following command, providing your websites sitemap url.
```sh
npm run report --url="https://www.domain.com/sitemap.xml"
```

### To Do
- Resolve async issue when running both lighthouse report generation and generating the csv (see index.js) 
- Optimisations