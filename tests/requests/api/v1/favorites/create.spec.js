var shell = require('shelljs');
var request = require("supertest");
var app = require('../../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../../knexfile')[environment];
const database = require('knex')(configuration);


describe('Test the favorites path', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade');
  });

  afterEach(() => {
    database.raw('truncate table favorites cascade');
  });

  describe('test favorites creation', () => {
    it('happy path', async () => {
      const res = await request(app)
        .post("/api/v1/favorites")
        .send({
          title: 'Sweet Emotion',
          artistName: 'Aerosmith'
        });

      let favorites = await database('favorites').select()
      expect(favorites.length).toBe(1);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('artistName');
      expect(res.body).toHaveProperty('genre');
      expect(res.body).toHaveProperty('rating');
    });
    
    it('sad path', async () => {
      const res = await request(app)
        .post("/api/v1/favorites")
        .send({
          title: '',
          artistName: ''
        });

      let favorites = await database('favorites').select()
      expect(favorites.length).toBe(0);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe("Invalid request body");
    });
  });
});
