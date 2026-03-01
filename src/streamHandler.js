'use strict';

const { idToUrl } = require('./iptvParser');
const { getChannel } = require('./channelStore');

/**
 * Stream handler — called when user clicks on a channel card in Stremio.
 *
 * KEY DESIGN: The channel id encodes the full stream URL as base64url.
 * We decode it directly — NO store lookup needed, NO network call.
 * This means streaming always works, even for channels not yet browsed.
 */
async function streamHandler({ type, id }) {
    console.log(`[stream] Request for id=${id}`);

    // 1. Decode the stream URL directly from the id
    let streamUrl = idToUrl(id);

    // 1b. Fallback for old/non-encoded ids: resolve from shared store
    const channel = getChannel(id);
    if ((!streamUrl || !/^https?:\/\//i.test(streamUrl)) && channel && channel.streamUrl) {
        streamUrl = channel.streamUrl;
        console.log('[stream] Resolved URL from channel store fallback');
    }

    if (!streamUrl || !/^https?:\/\//i.test(streamUrl)) {
        console.warn(`[stream] Could not decode URL from id: ${id}`);
        return { streams: [] };
    }

    // 2. Try to get channel metadata from the store for a nice title/description
    const name = channel ? channel.name : 'Live TV';
    const group = channel ? (channel.group || 'IPTV') : 'IPTV';

    console.log(`[stream] Decoded URL: ${streamUrl}`);

    return {
        streams: [
            {
                url: streamUrl,
                title: name,
                name: '📡 Live',
                description: group,
                behaviorHints: {
                    isLive: true,
                    notWebReady: true
                }
            }
        ]
    };
}

/**
 * Meta handler — returns channel details when user opens a channel page.
 */
async function metaHandler({ type, id }) {
    console.log(`[meta] Request for id=${id}`);

    const channel = getChannel(id);
    if (!channel) {
        // Minimal fallback meta from ID alone
        const streamUrl = idToUrl(id);
        if (!streamUrl) return { meta: null };
        return {
            meta: {
                id,
                type: 'tv',
                name: 'Live TV Channel',
                description: '📡 Live IPTV stream'
            }
        };
    }

    return {
        meta: {
            id: channel.id,
            type: 'tv',
            name: channel.name,
            poster: channel.logo || undefined,
            posterShape: 'square',
            background: channel.logo || undefined,
            logo: channel.logo || undefined,
            description: `📡 Live TV — ${channel.group || 'IPTV'}`,
            genres: channel.group ? [channel.group] : [],
        }
    };
}

/**
 * Preload the full channel index on startup so channels are available
 * in the store from the very first stream request.
 */
async function preloadIndex() {
    const { fetchM3U, buildM3UUrl } = require('./iptvParser');
    const { addChannels, storeSize } = require('./channelStore');

    console.log('[preload] Fetching full channel index...');
    try {
        const url = buildM3UUrl(null, null); // index.m3u
        const channels = await fetchM3U(url);
        const added = addChannels(channels);
        console.log(`[preload] Indexed ${storeSize()} channels (${added} new)`);
    } catch (err) {
        console.error('[preload] Failed:', err.message);
    }
}

module.exports = { streamHandler, metaHandler, preloadIndex };
