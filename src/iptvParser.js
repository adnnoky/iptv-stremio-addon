'use strict';

const fetch = require('node-fetch');

// Cache: url -> { data, timestamp }
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Encode a stream URL into a stable Stremio-safe channel ID.
 * We use full base64 (NO truncation) so we can decode it back.
 * base64url avoids +, /, = which break URL routing.
 */
function urlToId(streamUrl) {
    return 'iptv_' + Buffer.from(streamUrl).toString('base64url');
}

/**
 * Decode a channel ID back to the original stream URL.
 */
function idToUrl(id) {
    try {
        const b64 = id.replace(/^iptv_/, '');
        return Buffer.from(b64, 'base64url').toString('utf8');
    } catch (e) {
        return null;
    }
}

/**
 * Parse an M3U playlist string into an array of channel objects.
 */
function parseM3U(text) {
    const lines = text.split('\n').map(l => l.trim());
    const channels = [];
    let current = null;

    for (const line of lines) {
        if (line.startsWith('#EXTINF:')) {
            const name = (line.match(/,(.+)$/) || [])[1] || 'Unknown Channel';
            const logo = (line.match(/tvg-logo="([^"]*)"/) || [])[1] || '';
            const group = (line.match(/group-title="([^"]*)"/) || [])[1] || 'General';
            current = { name: name.trim(), logo, group };
        } else if (line && !line.startsWith('#') && current) {
            const streamUrl = line;
            const id = urlToId(streamUrl);
            channels.push({ ...current, id, streamUrl });
            current = null;
        }
    }

    return channels;
}

/**
 * Fetch and parse an M3U playlist from a URL. Results are cached for 1 hour.
 */
async function fetchM3U(url) {
    const now = Date.now();
    if (cache.has(url)) {
        const entry = cache.get(url);
        if (now - entry.timestamp < CACHE_TTL) {
            return entry.data;
        }
    }

    console.log(`[iptv-parser] Fetching: ${url}`);
    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Stremio-IPTV-Addon/1.0' },
            timeout: 15000
        });

        if (!res.ok) {
            console.warn(`[iptv-parser] HTTP ${res.status} for ${url}`);
            if (cache.has(url)) return cache.get(url).data;
            return [];
        }

        const text = await res.text();
        const data = parseM3U(text);
        console.log(`[iptv-parser] Parsed ${data.length} channels from ${url}`);
        cache.set(url, { data, timestamp: now });
        return data;
    } catch (err) {
        console.error(`[iptv-parser] Error fetching ${url}:`, err.message);
        if (cache.has(url)) return cache.get(url).data;
        return [];
    }
}

/**
 * Build the correct iptv-org URL based on catalog type and selected value.
 */
function buildM3UUrl(catalogId, selectedValue) {
    const BASE = 'https://iptv-org.github.io/iptv';
    if (!selectedValue) return `${BASE}/index.m3u`;
    if (catalogId === 'iptv-genre') return `${BASE}/categories/${selectedValue.toLowerCase()}.m3u`;
    if (catalogId === 'iptv-country') return `${BASE}/countries/${selectedValue.toLowerCase().replace(/[^a-z]/g, '')}.m3u`;
    if (catalogId === 'iptv-language') return `${BASE}/languages/${selectedValue.toLowerCase().replace(/[^a-z]/g, '')}.m3u`;
    return `${BASE}/index.m3u`;
}

module.exports = { fetchM3U, buildM3UUrl, urlToId, idToUrl };
