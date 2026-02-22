'use strict';

// Full list of iptv-org genres
const GENRES = [
  'animation', 'auto', 'business', 'classic', 'comedy', 'cooking',
  'culture', 'documentary', 'education', 'entertainment', 'family',
  'general', 'health', 'history', 'hobby', 'kids', 'legislative',
  'lifestyle', 'local', 'movies', 'music', 'news', 'outdoor',
  'pets', 'religious', 'sci-fi', 'shop', 'sports', 'travel',
  'weather', 'xxx'
];

// Popular countries (ISO 3166-1 alpha-2 → display name)
const COUNTRIES = {
  'us': '🇺🇸 United States', 'gb': '🇬🇧 United Kingdom', 'de': '🇩🇪 Germany',
  'fr': '🇫🇷 France', 'es': '🇪🇸 Spain', 'it': '🇮🇹 Italy',
  'tr': '🇹🇷 Turkey', 'ru': '🇷🇺 Russia', 'ua': '🇺🇦 Ukraine',
  'pl': '🇵🇱 Poland', 'nl': '🇳🇱 Netherlands', 'be': '🇧🇪 Belgium',
  'pt': '🇵🇹 Portugal', 'br': '🇧🇷 Brazil', 'mx': '🇲🇽 Mexico',
  'ar': '🇦🇷 Argentina', 'ca': '🇨🇦 Canada', 'au': '🇦🇺 Australia',
  'in': '🇮🇳 India', 'pk': '🇵🇰 Pakistan', 'bd': '🇧🇩 Bangladesh',
  'sa': '🇸🇦 Saudi Arabia', 'ae': '🇦🇪 UAE', 'eg': '🇪🇬 Egypt',
  'ng': '🇳🇬 Nigeria', 'za': '🇿🇦 South Africa', 'jp': '🇯🇵 Japan',
  'kr': '🇰🇷 South Korea', 'cn': '🇨🇳 China', 'id': '🇮🇩 Indonesia',
  'th': '🇹🇭 Thailand', 'vn': '🇻🇳 Vietnam', 'ph': '🇵🇭 Philippines',
  'se': '🇸🇪 Sweden', 'no': '🇳🇴 Norway', 'dk': '🇩🇰 Denmark',
  'fi': '🇫🇮 Finland', 'cz': '🇨🇿 Czech Republic', 'ro': '🇷🇴 Romania',
  'hu': '🇭🇺 Hungary', 'sk': '🇸🇰 Slovakia', 'bg': '🇧🇬 Bulgaria',
  'rs': '🇷🇸 Serbia', 'hr': '🇭🇷 Croatia', 'ba': '🇧🇦 Bosnia',
  'gr': '🇬🇷 Greece', 'il': '🇮🇱 Israel', 'ir': '🇮🇷 Iran',
  'iq': '🇮🇶 Iraq', 'af': '🇦🇫 Afghanistan', 'ma': '🇲🇦 Morocco'
};

// Popular languages (ISO 639-3 → display name)
const LANGUAGES = {
  'eng': '🇬🇧 English', 'spa': '🇪🇸 Spanish', 'fra': '🇫🇷 French',
  'deu': '🇩🇪 German', 'por': '🇵🇹 Portuguese', 'ita': '🇮🇹 Italian',
  'rus': '🇷🇺 Russian', 'ara': '🇸🇦 Arabic', 'tur': '🇹🇷 Turkish',
  'pol': '🇵🇱 Polish', 'nld': '🇳🇱 Dutch', 'ukr': '🇺🇦 Ukrainian',
  'hin': '🇮🇳 Hindi', 'urd': '🇵🇰 Urdu', 'ben': '🇧🇩 Bengali',
  'fas': '🇮🇷 Persian', 'heb': '🇮🇱 Hebrew', 'jpn': '🇯🇵 Japanese',
  'kor': '🇰🇷 Korean', 'zho': '🇨🇳 Chinese', 'ind': '🇮🇩 Indonesian',
  'tha': '🇹🇭 Thai', 'vie': '🇻🇳 Vietnamese', 'swe': '🇸🇪 Swedish',
  'nor': '🇳🇴 Norwegian', 'dan': '🇩🇰 Danish', 'fin': '🇫🇮 Finnish',
  'ces': '🇨🇿 Czech', 'ron': '🇷🇴 Romanian', 'hun': '🇭🇺 Hungarian',
  'srp': '🇷🇸 Serbian', 'hrv': '🇭🇷 Croatian', 'ell': '🇬🇷 Greek',
  'bul': '🇧🇬 Bulgarian', 'slk': '🇸🇰 Slovak', 'lit': '🇱🇹 Lithuanian'
};

const manifest = {
  id: 'community.iptv.stremio',
  version: '1.0.0',
  name: '🌍 IPTV World',
  description: 'Free live IPTV channels from around the world — browse by country, language, or genre. Powered by iptv-org.',
  logo: 'https://dl.strem.io/addon-logo.png',
  background: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1920',
  types: ['tv'],
  catalogs: [
    {
      id: 'iptv-genre',
      type: 'tv',
      name: '📺 By Channel Type',
      extra: [
        {
          name: 'genre',
          isRequired: false,
          options: GENRES.map(g => g.charAt(0).toUpperCase() + g.slice(1))
        },
        { name: 'search', isRequired: false },
        { name: 'skip', isRequired: false }
      ]
    },
    {
      id: 'iptv-country',
      type: 'tv',
      name: '🌍 By Country',
      extra: [
        {
          name: 'genre',
          isRequired: false,
          options: Object.values(COUNTRIES)
        },
        { name: 'search', isRequired: false },
        { name: 'skip', isRequired: false }
      ]
    },
    {
      id: 'iptv-language',
      type: 'tv',
      name: '🗣️ By Language',
      extra: [
        {
          name: 'genre',
          isRequired: false,
          options: Object.values(LANGUAGES)
        },
        { name: 'search', isRequired: false },
        { name: 'skip', isRequired: false }
      ]
    }
  ],
  resources: ['catalog', 'stream', 'meta'],
  idPrefixes: ['iptv_'],
  behaviorHints: {
    configurable: false,
    newEpisodeNotifications: false
  }
};

module.exports = { manifest, GENRES, COUNTRIES, LANGUAGES };
