var shell = require('shelljs');
var request = require("supertest");
var musixMatchService = require('../../lib/services/musixMatchService');

describe('Test ', () => {
  test('It should get a json response from the MusixMatch API', async () => {
    let response = await musixMatchService.getTracks("Sweet Emotion", "Aerosmith")

    expect(response).toHaveProperty('message')
    expect(response.message).toHaveProperty('body')
    expect(response.message.body).toHaveProperty('track')
    expect(response.message.body.track).toHaveProperty('track_name')
    expect(response.message.body.track.track_name).toBe('Sweet Emotion')
    expect(response.message.body.track).toHaveProperty('artist_name')
    expect(response.message.body.track.artist_name).toBe('Aerosmith')
  });

  test('It should get an empty body json response from the MusixMatch API', async () => {
    let response = await musixMatchService.getTracks("", "")

    expect(response).toHaveProperty('message')
    expect(response.message).toHaveProperty('body')
    expect(response.message.body).toBe("")
  });
});
