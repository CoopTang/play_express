var shell = require('shelljs');
var request = require("supertest");
var app = require('../../../../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../../../../knexfile')[environment];
const database = require('knex')(configuration);


describe('Test the playlists path', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');

    let playlistData = {
      "title": "Runnin' fo fun"
    }

    await database('playlists').insert(playlistData);
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
  });

  describe('test playlists show', () => {
    it('happy path', async () => {
      const playlist = await database('playlists').first()

      const playlistId = playlist.id
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

        let favorites = await database('favorites').select()

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe("Invalid request body");
      });
    });
  });
});