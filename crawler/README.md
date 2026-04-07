# Crawlee Scraper Layer

This project is the scraper-first ingestion layer for the no-AI MVP.

## Purpose

- crawl approved public maritime parts sources
- extract listing data
- normalize records into the shared listing schema
- store records for the website/backend to query

## MVP policy

- no AI in the request path
- use HTTP/HTML crawling by default
- use browser crawling only where necessary
- keep source adapters explicit and controlled

## Planned structure

```text
crawler/
├── src/
│   ├── main.js
│   ├── config/
│   │   └── sources.js
│   ├── crawlers/
│   │   ├── source-cheerio.js
│   │   ├── source-playwright.js
│   │   └── shared.js
│   ├── extractors/
│   │   ├── listingFields.js
│   │   ├── normalizePrice.js
│   │   ├── normalizeCondition.js
│   │   └── normalizeImage.js
│   ├── pipelines/
│   │   ├── saveListing.js
│   │   ├── dedupeListing.js
│   │   └── expireStaleListings.js
│   ├── db/
│   │   └── client.js
│   └── utils/
│       ├── logger.js
│       └── hashListing.js
├── package.json
└── .env.example
```

## Next build steps

1. define first 2–3 approved sources
2. build source registry
3. implement first Cheerio-based source adapter
4. normalize output into listing schema
5. save to database
