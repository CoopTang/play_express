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

  describe('Test Favorites Index', () => {
    it('happy path', async () => {
      let favoriteData_2 = {
        "title": "We are the Champions",
        "artistName": "Queen",
        "genre": "Rock",
        "rating": 100
      }
      let playlist   = await database('playlists').select().first()
      let favorite_1 = await database('favorites').select().first()
      let favorite_2 = await database('favorites').insert(favoriteData_2, ['id', 'title', 'artistName', 'rating', 'genre']);

      await database('playlist_favorites').insert({playlistId: playlist.id, favoriteId: favorite_1.id}, 'id')
      await database('playlist_favorites').insert({playlistId: playlist.id, favoriteId: favorite_2[0].id}, 'id')

      const res = await request(app)
        .get(`/api/v1/playlists/${playlist.id}/favorites`)

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title');
      expect(res.body.title).toBe('Coding Vibes')
      expect(res.body).toHaveProperty('createdAt');
      expect(res.body).toHaveProperty('updatedAt');
      expect(res.body).toHaveProperty('songCount');
      expect(res.body.songCount).toBe(2)
      expect(res.body).toHaveProperty('songAvgRating');
      expect(res.body.songAvgRating).toBe(90.5)
      expect(res.body).toHaveProperty('favorites');
      expect(res.body.favorites[0].id).toBe(favorite_1.id)
      expect(res.body.favorites[0].title).toBe(favorite_1.title)
      expect(res.body.favorites[0].artistName).toBe(favorite_1.artistName)
      expect(res.body.favorites[0].genre).toBe(favorite_1.genre)
      expect(res.body.favorites[0].rating).toBe(favorite_1.rating)

      expect(res.body.favorites[1].id).toBe(favorite_2[0].id)
      expect(res.body.favorites[1].title).toBe(favorite_2[0].title)
      expect(res.body.favorites[1].artistName).toBe(favorite_2[0].artistName)
      expect(res.body.favorites[1].genre).toBe(favorite_2[0].genre)
      expect(res.body.favorites[1].rating).toBe(favorite_2[0].rating)
    });

    it('id does not exist in database', async () => {
      const res = await request(app)
      .get('/api/v1/playlists/9999/favorites')

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Playlist with that ID does not exist!');
    });

    it('id must be a number', async () => {
      const res = await request(app)
      .get('/api/v1/playlists/asdf/favorites')

      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe("ID must be a number!")
    })
  });
});
