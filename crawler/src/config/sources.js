export const sources = [
  {
    name: 'example-static-source',
    crawlerType: 'cheerio',
    startUrls: ['https://example.com/parts'],
    allowedDomains: ['example.com'],
    categoryMap: {},
    refreshIntervalHours: 24
  },
  {
    name: 'example-js-source',
    crawlerType: 'playwright',
    startUrls: ['https://example.org/listings'],
    allowedDomains: ['example.org'],
    categoryMap: {},
    refreshIntervalHours: 24
  }
];
