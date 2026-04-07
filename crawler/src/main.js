import { sources } from './config/sources.js';

console.log('Marine Parts Locator crawler scaffold');
console.log('Configured sources:', sources.map(source => source.name));
console.log('Next step: implement per-source Crawlee adapters and persistence layer.');
