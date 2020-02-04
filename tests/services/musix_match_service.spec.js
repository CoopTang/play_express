var shell = require('shelljs');
var request = require("supertest");
var musixMatchService = require('../../lib/services/musix_match_service');

describe('Test ', () => {
  test('It should get a json response from the MusixMatch API', async () => {
    let response = await musixMatchService.getTracks("We Will Rock You", "Queen")

    expect(response).toHaveProperty('message')
    expect(response.message).toHaveProperty('body')
    expect(response.message.body).toHaveProperty('track')
    expect(response.message.body.track).toHaveProperty('track_name')
    expect(response.message.body.track.track_name).toBe('We Will Rock You')
    expect(response.message.body.track).toHaveProperty('artist_name')
    expect(response.message.body.track.artist_name).toBe('Queen')
  });
});
