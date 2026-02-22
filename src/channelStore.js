'use strict';

/**
 * Shared channel store — populated by BOTH catalog and stream handlers.
 * Key: channel.id (string)
 * Value: channel object { id, name, logo, group, streamUrl }
 */
const channelStore = new Map();

/**
 * Add an array of parsed M3U channel objects to the store.
 */
function addChannels(channels) {
    let added = 0;
    for (const ch of channels) {
        if (!channelStore.has(ch.id)) {
            channelStore.set(ch.id, ch);
            added++;
        }
    }
    return added;
}

/**
 * Look up a single channel by id.
 */
function getChannel(id) {
    return channelStore.get(id) || null;
}

/**
 * Return current store size (for logging).
 */
function storeSize() {
    return channelStore.size;
}

module.exports = { addChannels, getChannel, storeSize };
