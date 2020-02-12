var shell = require('shelljs');
var request = require("supertest");
var app = require('../../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../../knexfile')[environment];
const database = require('knex')(configuration);


describe('Test the Playlists path', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');
    await database.raw('truncate table favorites cascade');

    let favoriteData_1 = {
      "title": "We Will Rock You",
      "artistName": "Queen",
      "genre": "Rock",
      "rating": 81
    }

    await database('playlists').insert({ title: "Coding Vibes" }, 'id');
    await database('favorites').insert(favoriteData_1, 'id');
  });

  afterEach(() => {
    database.raw('truncate table favorites cascade');
    database.raw('truncate table playlists cascade');
    database.raw('truncate table playlist_favorites cascade');
  });

  describe('Test Favorite Creation', () => {
    it('happy path', async () => {
      const playlist = await database('playlists').select().first()
      const favorite = await database('favorites').select().first()
      const res = await request(app)
        .post(`/api/v1/playlists/${playlist.id}/favorites/${favorite.id}`)

      let favorites = await database('playlist_favorites').select()
      expect(favorites.length).toBe(1);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('Success');
      expect(res.body.Success).toBe(`${favorite.title} has been added to ${playlist.title}!`);
    });

    it('id does not exist in database', async () => {
      const res = await request(app)
      .post('/api/v1/playlists/9999/favorites/9999')

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Playlist or Favorite with that ID does not exist!');
    });

    it('id must be a number', async () => {
      const res = await request(app)
      .post('/api/v1/playlists/asdf/favorites/asdf')

      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe("ID must be a number!")
    })
  });

  describe('Test Favorite Deletion', () => {
    it('happy path', async () => {
      const playlist = await database('playlists').select().first()
      const favorite = await database('favorites').select().first()
      await database('playlist_favorites').insert({playlistId: playlist.id, favoriteId: favorite.id}, 'id')

      const res = await request(app)
        .delete(`/api/v1/playlists/${playlist.id}/favorites/${favorite.id}`)

      let favorites = await database('playlist_favorites').select()
      expect(favorites.length).toBe(0);

      expect(res.statusCode).toBe(204);
    });

    it('id does not exist in database', async () => {
      const res = await request(app)
      .delete('/api/v1/playlists/9999/favorites/9999')

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Playlist or Favorite with that ID does not exist!');
    });

    it('id must be a number', async () => {
      const res = await request(app)
      .delete('/api/v1/playlists/asdf/favorites/asdf')

      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe("ID must be a number!")
    })
  });
});
