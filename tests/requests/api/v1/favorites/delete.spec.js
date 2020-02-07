var shell   = require('shelljs');
var request = require("supertest");
var app     = require('../../../../../app');

const environment   = process.env.NODE_ENV || 'test';
const configuration = require('../../../../../knexfile')[environment];
const database      = require('knex')(configuration);


describe('Test the favorites path', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade');
    let favoriteData = {
      "id": 1,
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

  describe('test favorites deletion', () => {
    it('happy path', async () => {
      const favorite = await database('favorites').first()
      expect(favorite.artistName).toBe('Queen');

      const res = await request(app)
        .delete(`/api/v1/favorites/${favorite.id}`)

      expect(res.statusCode).toBe(204);

      const favorites = await database('favorites').select()
      expect(favorites.length).toBe(0);
    });
    
    describe('sad path', () => {
      it('id does not exist in database', async () => {
        const res = await request(app)
          .delete(`/api/v1/favorites/9999`)
  
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Favorite with that ID does not exist!');
      });

      it('id must be a number', async () => {
        const res = await request(app)
          .delete(`/api/v1/favorites/asdf`)
  
        expect(res.statusCode).toBe(500)
        expect(res.body.message).toBe("ID must be a number!")
      })
    });
  });
});
