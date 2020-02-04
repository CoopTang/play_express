var fetch = require('node-fetch')
const { URLSearchParams } = require('url');
 
require('dotenv').config();

const MUSIX_URL = "https://api.musixmatch.com/ws/1.1"
const TRACK_SEARCH_PATH = "track.search"

async function getTracks(title, artist) {
  const url = new URL(`${MUSIX_URL}/${TRACK_SEARCH_PATH}`)
  url.searchParams.append('q_track', title);
  url.searchParams.append('q_artist', artist);
  url.searchParams.append('apikey', process.env.MUSIX_MATCH_API_KEY);
  return await fetch(url.href)
    .then(data => { return data.json(); })
    .catch(reason => { console.log(reason.message) });
}

module.exports = { getTracks };