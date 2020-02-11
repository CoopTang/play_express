var shell = require('shelljs');
var request = require("supertest");
var app = require('../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);


describe('Test the favorites path', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade');

    let favoriteData_1 = {
      "title": "We Will Rock You",
      "artistName": "Queen",
      "genre": "Rock",
      "rating": 88
    }
    let favoriteData_2 = {
      "title": "We are the Champions",
      "artistName": "Queen",
      "genre": "Rock",
      "rating": 100
    }
    await database('favorites').insert(favoriteData_1, 'id');
    await database('favorites').insert(favoriteData_2, 'id');
  });

  afterEach(() => {
    database.raw('truncate table favorites cascade');
  });

  describe('test favorites index', () => {
    it('happy path', async () => {
      const res = await request(app)
        .get("/api/v1/favorites");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0].title).toBe('We Will Rock You');
      expect(res.body[0]).toHaveProperty('artistName');
      expect(res.body[0].artistName).toBe('Queen');
      expect(res.body[0]).toHaveProperty('genre');
      expect(res.body[0].genre).toBe('Rock');
      expect(res.body[0]).toHaveProperty('rating');
      expect(res.body[0].rating).toBe(88);
      expect(res.body[0]).not.toHaveProperty('created_at');
      expect(res.body[0]).not.toHaveProperty('updated_at');

      expect(res.body[1]).toHaveProperty('id');
      expect(res.body[1]).toHaveProperty('title');
      expect(res.body[1].title).toBe('We are the Champions');
      expect(res.body[1]).toHaveProperty('artistName');
      expect(res.body[1].artistName).toBe('Queen');
      expect(res.body[1]).toHaveProperty('genre');
      expect(res.body[1].genre).toBe('Rock');
      expect(res.body[1]).toHaveProperty('rating');
      expect(res.body[1].rating).toBe(100);
      expect(res.body[1]).not.toHaveProperty('created_at');
      expect(res.body[1]).not.toHaveProperty('updated_at');
    });
  });

  describe('test favorites show', () => {
    it('happy path', async () => {
      const favorite = await database('favorites').first()
      const res = await request(app)
        .get(`/api/v1/favorites/${favorite.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title');
      expect(res.body.title).toBe('We Will Rock You');
      expect(res.body).toHaveProperty('artistName');
      expect(res.body.artistName).toBe('Queen');
      expect(res.body).toHaveProperty('genre');
      expect(res.body.genre).toBe('Rock');
      expect(res.body).toHaveProperty('rating');
      expect(res.body.rating).toBe(88);
      expect(res.body).not.toHaveProperty('created_at');
      expect(res.body).not.toHaveProperty('updated_at');
    });

    describe('sad path', () => {
      it('id does not exist in database', async () => {
        const res = await request(app)
          .get(`/api/v1/favorites/9999`)
  
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Favorite with that ID does not exist!');
      });

      it('id must be a number', async () => {
        const res = await request(app)
          .get(`/api/v1/favorites/asdf`)
  
        expect(res.statusCode).toBe(500)
        expect(res.body.message).toBe("ID must be a number!")
      })
    });
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
      expect(favorites.length).toBe(3);
      
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
      expect(favorites.length).toBe(2);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe("Invalid request body");
    });
  });

  describe('test favorites deletion', () => {
    it('happy path', async () => {
      const favorite = await database('favorites').first()

      const res = await request(app)
        .delete(`/api/v1/favorites/${favorite.id}`)

      expect(res.statusCode).toBe(204);

      const favorites = await database('favorites').select()
      expect(favorites.length).toBe(1);
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
