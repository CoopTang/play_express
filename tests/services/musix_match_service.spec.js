var shell = require('shelljs');
var request = require("supertest");
var musixMatchService = require('../../lib/services/musix_match_service');

describe('Test ', () => {
  test('It should get a json response from the MusixMatch API', async () => {
    let response = await musixMatchService.getTracks("We Will Rock You", "Queen")

    expect(response).toHaveProperty('message')
    expect(response.message).toHaveProperty('body')
    expect(response.message.body).toHaveProperty('track_list')
    expect(response.message.body.track_list[0]).toHaveProperty('track')
  });
});
