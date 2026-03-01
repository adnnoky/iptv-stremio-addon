# 🌍 IPTV Stremio Addon

A Stremio addon that provides **free live IPTV channels** from around the world, organized into 3 browsable catalogs.

## Features

- 📺 **Channel Type** — Browse by genre: News, Sports, Movies, Music, Documentaries, and more
- 🌍 **Country** — Over 50 countries: US, UK, Germany, France, Turkey, India...
- 🗣️ **Language** — Over 35 languages: English, Spanish, Arabic, Hindi, Japanese...
- 🔍 **Search** support within any catalog
- ⚡ **1-hour caching** of M3U playlists for fast responses
- 📡 Powered by [iptv-org/iptv](https://github.com/iptv-org/iptv) — 8000+ free channels

## Requirements

- [Node.js](https://nodejs.org/) v14 or newer
- [Stremio](https://www.stremio.com/) desktop app

## Installation

```bash
# 1. Go to the addon folder
cd "iptv-stremio-addon"

# 2. Install dependencies
npm install

# 3. Start the addon
npm start
```

## Adding to Stremio

1. Run the addon (see above)
2. Open **Stremio**
3. Click the 🔍 **search** icon in the top menu
4. Paste this URL: `http://127.0.0.1:7000/manifest.json`
5. Click **Install**

The addon will appear in **Discover** under the `TV` type with three category rows.

## Available Channel Types

`Animation, Auto, Business, Classic, Comedy, Cooking, Culture, Documentary, Education, Entertainment, Family, General, Health, History, Hobby, Kids, Legislative, Lifestyle, Local, Movies, Music, News, Outdoor, Pets, Religious, Sci-Fi, Shop, Sports, Travel, Weather`

## Project Structure

```
iptv-stremio-addon/
├── index.js              # Entry point — starts the addon server
├── package.json
└── src/
    ├── manifest.js        # Stremio manifest (catalogs, resources, types)
    ├── iptvParser.js      # M3U fetcher + parser + cache
    ├── catalogHandler.js  # Handles catalog requests (channel lists)
    └── streamHandler.js   # Handles stream + meta requests
```

## Data Source

All playlists come from **[iptv-org.github.io/iptv](https://iptv-org.github.io/iptv/)**.
Channels are updated continuously by the iptv-org community.
