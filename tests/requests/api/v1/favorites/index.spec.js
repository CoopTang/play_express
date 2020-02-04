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
      "title": "We Will Rock You",
      "artistName": "Queen",
      "genre": "Rock",
      "rating": 88
    }
    await database('favorites').insert(favoriteData, 'id');
  });

  afterEach(() => {
    database.raw('truncate table favorites cascade');
  });

  describe('test favorites index', () => {
    it('happy path', async () => {
      const favorite = await database('favorites').select()
      console.log(favorite)
      const res = await request(app)
        .get("/api/v1/favorites");

      expect(res.statusCode).toBe(200);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0].title).toBe('We Will Rock You');
      expect(res.body[0]).toHaveProperty('artistName');
      expect(res.body[0].artistName).toBe('Queen');
      expect(res.body[0]).toHaveProperty('genre');
      expect(res.body[0].genre).toBe('Rock');
      expect(res.body[0]).toHaveProperty('rating');
      expect(res.body[0].rating).toBe(88);
    });
  });
});
