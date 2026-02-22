'use strict';

const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const { manifest } = require('./src/manifest');
const { catalogHandler } = require('./src/catalogHandler');
const { streamHandler, metaHandler, preloadIndex } = require('./src/streamHandler');

const PORT = process.env.PORT || 7000;
const RENDER_URL = process.env.RENDER_EXTERNAL_URL; // set automatically by Render

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

        // Preload the full channel index so streams resolve immediately
        preloadIndex().catch(err => console.error('[preload] Error:', err.message));

        // Keep-alive: ping ourselves every 14 min to prevent Render free tier spin-down
        if (RENDER_URL) {
            const fetch = require('node-fetch');
            const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
            setInterval(() => {
                fetch(`${RENDER_URL}/manifest.json`)
                    .then(() => console.log('[keep-alive] Pinged OK'))
                    .catch(err => console.warn('[keep-alive] Ping failed:', err.message));
            }, PING_INTERVAL);
            console.log(`[keep-alive] Self-ping enabled every 14 min → ${RENDER_URL}`);
        }
    })
    .catch(err => {
        console.error('Failed to start:', err);
        process.exit(1);
    });
