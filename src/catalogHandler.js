'use strict';

const { fetchM3U, buildM3UUrl } = require('./iptvParser');
const { GENRES, COUNTRIES, LANGUAGES } = require('./manifest');
const { addChannels } = require('./channelStore');

const PAGE_SIZE = 100;

const DEFAULT_POSTER = 'https://dl.strem.io/addon-logo.png';

function channelToMeta(ch) {
    return {
        id: ch.id,
        type: 'tv',
        name: ch.name,
        poster: ch.logo || DEFAULT_POSTER,
        posterShape: 'square',
        background: ch.logo || undefined,
        logo: ch.logo || undefined,
        description: `📡 ${ch.group || 'IPTV'} — Live TV`,
        genres: ch.group ? [ch.group] : [],
    };
}

function resolveM3UUrl(catalogId, genre) {
    if (!genre) return buildM3UUrl(catalogId, null);

    if (catalogId === 'iptv-genre') {
        return buildM3UUrl(catalogId, genre);
    }

    if (catalogId === 'iptv-country') {
        const code = Object.keys(COUNTRIES).find(
            k => COUNTRIES[k].toLowerCase() === genre.toLowerCase()
        );
        return buildM3UUrl(catalogId, code || 'us');
    }

    if (catalogId === 'iptv-language') {
        const code = Object.keys(LANGUAGES).find(
            k => LANGUAGES[k].toLowerCase() === genre.toLowerCase()
        );
        return buildM3UUrl(catalogId, code || 'eng');
    }

    return buildM3UUrl(catalogId, null);
}

async function catalogHandler({ type, id, extra }) {
    const genre = extra && extra.genre ? extra.genre : null;
    const search = extra && extra.search ? extra.search.toLowerCase() : null;
    const skip = extra && extra.skip ? parseInt(extra.skip, 10) : 0;

    console.log(`[catalog] id=${id} genre=${genre} search=${search} skip=${skip}`);

    const m3uUrl = resolveM3UUrl(id, genre);
    let channels = await fetchM3U(m3uUrl);

    // ✅ KEY FIX: add all channels from this playlist to the shared store
    // so the stream handler can find them when user clicks a channel.
    const added = addChannels(channels);
    if (added > 0) {
        console.log(`[catalog] Added ${added} new channels to stream store`);
    }

    if (search) {
        channels = channels.filter(ch => ch.name.toLowerCase().includes(search));
    }

    const page = channels.slice(skip, skip + PAGE_SIZE);
    const metas = page.map(channelToMeta);

    return { metas };
}

module.exports = { catalogHandler };
