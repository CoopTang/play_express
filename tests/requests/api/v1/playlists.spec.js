var shell = require('shelljs');
var request = require("supertest");
var app = require('../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);


describe('Test the Playlists path', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlist_favorites cascade');
    await database.raw('truncate table playlists cascade');
    await database.raw('truncate table favorites cascade');
    
    await database('playlists').insert({ "title": "Coding Vibes" }, 'id');
    await database('playlists').insert({ "title": "Workout Mix"  }, 'id');
  });
  
  afterEach(() => {
    database.raw('truncate table playlist_favorites cascade');
    database.raw('truncate table playlists cascade');
    database.raw('truncate table favorites cascade');
  });

  describe('Test Playlists Index', () => {
    it('happy path', async () => {
      let favoriteData_1 = {
        "title": "We Will Rock You",
        "artistName": "Queen",
        "genre": "Rock",
        "rating": 25
      }
      let favoriteData_2 = {
        "title": "We are the Champions",
        "artistName": "Queen",
        "genre": "Rock",
        "rating": 30
      }
      const playlists = await database('playlists').select()
      const favorite1 = await database('favorites').insert(favoriteData_1, 'id');
      const favorite2 = await database('favorites').insert(favoriteData_2, 'id');

      await database('playlist_favorites')
        .insert({playlistId: playlists[0].id, favoriteId: favorite1[0]});
      await database('playlist_favorites')
        .insert({playlistId: playlists[0].id, favoriteId: favorite2[0]});
      await database('playlist_favorites')
        .insert({playlistId: playlists[1].id, favoriteId: favorite1[0]});

      const res = await request(app)
        .get("/api/v1/playlists");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('songCount');
      expect(res.body[0].songCount).toBe(2)
      expect(res.body[0]).toHaveProperty('songAvgRating');
      expect(res.body[0].songAvgRating).toBe(27.5);
      expect(res.body[0]).toHaveProperty('favorites');
      expect(res.body[0].title).toBe('Coding Vibes');
      expect(res.body[0]).toHaveProperty('createdAt');
      expect(res.body[0]).toHaveProperty('updatedAt');
      
      expect(res.body[1]).toHaveProperty('id');
      expect(res.body[1]).toHaveProperty('title');
      expect(res.body[1]).toHaveProperty('songCount');
      expect(res.body[1].songCount).toBe(1)
      expect(res.body[1]).toHaveProperty('songAvgRating');
      expect(res.body[1].songAvgRating).toBe(25.0);
      expect(res.body[1]).toHaveProperty('favorites');
      expect(res.body[1].title).toBe('Workout Mix');
      expect(res.body[1]).toHaveProperty('createdAt');
      expect(res.body[1]).toHaveProperty('updatedAt');
    });
  });

  describe('Test playlists creation', () => {
    it('happy path', async () => {
      const res = await request(app)
        .post("/api/v1/playlists")
        .send({
          title: 'Coding Vibes'
        });

      let playlists = await database('playlists').select()
      expect(playlists.length).toBe(3);

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
      expect(playlists.length).toBe(2);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe("Invalid request body");
    });
  });

  describe('test playlists deletion', () => {
    it('happy path', async () => {
      const playlist = await database('playlists').first()

      const res = await request(app)
        .delete(`/api/v1/playlists/${playlist.id}`)

      expect(res.statusCode).toBe(204);

      const playlists = await database('playlists').select()
      expect(playlists.length).toBe(1);
    });
    
    describe('sad path', () => {
      it('id does not exist in database', async () => {
        const res = await request(app)
          .delete(`/api/v1/playlists/9999`)
  
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Playlist with that ID does not exist!');
      });

      it('id must be a number', async () => {
        const res = await request(app)
          .delete(`/api/v1/playlists/asdf`)
  
        expect(res.statusCode).toBe(500)
        expect(res.body.message).toBe("ID must be a number!")
      })
    });
  });

  describe('test playlists update', () => {
    it('happy path', async () => {
      const playlist = await database('playlists').first()

      const playlistUpdateAt = playlist.playlistUpdateAt

      const res = await request(app)
        .put(`/api/v1/playlists/${playlist.id}`)
        .send({
          "title": "I hate running"
        })

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title');
      expect(res.body.title).toBe('I hate running')
      expect(res.body).toHaveProperty('createdAt');
      expect(res.body).toHaveProperty('updatedAt');
      expect(res.body.updatedAt).not.toBe(playlistUpdateAt);
    });

    describe('sad path', () => {
      it('id does not exist in database', async () => {
        const res = await request(app)
          .put(`/api/v1/playlists/9999`)
          .send({
            "title": "I hate running"
          })
  
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Playlist with that ID does not exist!');
      });

      it('id must be a number', async () => {
        const res = await request(app)
          .put(`/api/v1/playlists/asdf`)
          .send({
            "title": "I hate running"
          })
  
        expect(res.statusCode).toBe(500)
        expect(res.body.message).toBe("ID must be a number!")
      });

      it('must have a valid request body', async () => {
        const playlist = await database('playlists').first()

        const res = await request(app)
          .put(`/api/v1/playlists/${playlist.id}`)
          .send({
            notAKey: "asdf"
          })

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe("Invalid request body");
      });
    });
  });
});
