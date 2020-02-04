var shell = require('shelljs');
var request = require("supertest");
var service = require('../../lib/services/api_querier');
require('dotenv').config()

describe('Test ', () => {
  test('It should get a json response from the API', async () => {
    const MUSIX_URL = "https://api.musixmatch.com/ws/1.1/"
    const SEARCH_PATH = "track.search"
    options = {
      params: {
        q_track: "We Will Rock You",
        q_artist: "Queen",
        apikey: process.env.MUSIX_MATCH_API_KEY
      }
    }
    const url = `${MUSIX_URL}/${SEARCH_PATH}`

    let response = await service.fetchAsync(url, options)

    expect(response).toHaveProperty('message')
    expect(response.message).toHaveProperty('body')
    expect(response.message.body).toHaveProperty('track_list')
    expect(response.message.body.track_list[0]).toHaveProperty('track')
  });
});
