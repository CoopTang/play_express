var shell = require('shelljs');
var request = require("supertest");
var app = require('../../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../../knexfile')[environment];
const database = require('knex')(configuration);


describe('Test the Playlists path', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');

    await database('playlists').insert({ "title": "Coding Vibes" }, 'id');
    await database('playlists').insert({ "title": "Workout Mix"  }, 'id');
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
  });

  describe('Test Playlists Index', () => {
    it('happy path', async () => {
      const playlist = await database('playlists').select()
      const res = await request(app)
        .get("/api/v1/playlists");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0].title).toBe('Coding Vibes');
      expect(res.body[0]).toHaveProperty('createdAt');
      expect(res.body[0]).toHaveProperty('updatedAt');

      expect(res.body[1]).toHaveProperty('id');
      expect(res.body[1]).toHaveProperty('title');
      expect(res.body[1].title).toBe('Workout Mix');
      expect(res.body[1]).toHaveProperty('createdAt');
      expect(res.body[1]).toHaveProperty('updatedAt');
    });
  });
});
