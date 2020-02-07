var shell = require('shelljs');
var request = require("supertest");
var app = require('../../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../../knexfile')[environment];
const database = require('knex')(configuration);


describe('Test the Playlists path', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
  });

  describe('test playlists creation', () => {
    it('happy path', async () => {
      const res = await request(app)
        .post("/api/v1/playlists")
        .send({
          title: 'Coding Vibes'
        });

      let playlists = await database('playlists').select()
      expect(playlists.length).toBe(1);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title');
      expect(res.body.title).toBe('Coding Vibes');
      expect(res.body).toHaveProperty('createdAt');
      expect(res.body).toHaveProperty('updatedAt');
    });

    it('sad path', async () => {
      const res = await request(app)
        .post("/api/v1/playlists")
        .send({
          title: ''
        });

      let playlists = await database('playlists').select()
      expect(playlists.length).toBe(0);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe("Invalid request body");
    });
  });
});
