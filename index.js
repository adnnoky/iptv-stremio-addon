'use strict';

const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const { manifest } = require('./src/manifest');
const { catalogHandler } = require('./src/catalogHandler');
const { streamHandler, metaHandler, preloadIndex } = require('./src/streamHandler');

const PORT = process.env.PORT || 7000;

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(catalogHandler);
builder.defineStreamHandler(streamHandler);
builder.defineMetaHandler(metaHandler);

const addonInterface = builder.getInterface();

// serveHTTP already adds cors() via getRouter internally
serveHTTP(addonInterface, { port: PORT, cacheMaxAge: 0 })
    .then(() => {
        console.log('');
        console.log('╔══════════════════════════════════════════════════════╗');
        console.log('║          🌍  IPTV Stremio Addon is RUNNING!          ║');
        console.log('╠══════════════════════════════════════════════════════╣');
        console.log(`║  Local URL : http://127.0.0.1:${PORT}/manifest.json     ║`);
        console.log('║  To install: paste URL above into Stremio search    ║');
        console.log('╚══════════════════════════════════════════════════════╝');
        console.log('');
        preloadIndex().catch(err => console.error('[preload] Error:', err.message));
    })
    .catch(err => {
        console.error('Failed to start:', err);
        process.exit(1);
    });
