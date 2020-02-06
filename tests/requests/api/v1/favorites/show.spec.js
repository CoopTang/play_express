var shell = require('shelljs');
var request = require("supertest");
var app = require('../../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../../knexfile')[environment];
const database = require('knex')(configuration);


describe('Test the favorites path', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade');

    let favoriteData = {
      "title": "Sweet Emotion",
      "artistName": "Aerosmith",
      "genre": "Rock",
      "rating": 88
    }

    await database('favorites').insert(favoriteData, 'id');
  });

  afterEach(() => {
    database.raw('truncate table favorites cascade');
  });

  describe('test favorites show', () => {
    it('happy path', async () => {
      const favorite = await database('favorites').first()
      const res = await request(app)
        .get(`/api/v1/favorites/${favorite.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title');
      expect(res.body.title).toBe('Sweet Emotion');
      expect(res.body).toHaveProperty('artistName');
      expect(res.body.artistName).toBe('Aerosmith');
      expect(res.body).toHaveProperty('genre');
      expect(res.body.genre).toBe('Rock');
      expect(res.body).toHaveProperty('rating');
      expect(res.body.rating).toBe(88);
    });

    it('sad path', async () => {
      const res = await request(app)
        .get(`/api/v1/favorites/9999`)

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Favorite with that ID does not exist!");
    });
  });
});
