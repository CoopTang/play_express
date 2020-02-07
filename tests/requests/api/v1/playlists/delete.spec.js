var shell   = require('shelljs');
var request = require("supertest");
var app     = require('../../../../../app');

const environment   = process.env.NODE_ENV || 'test';
const configuration = require('../../../../../knexfile')[environment];
const database      = require('knex')(configuration);


describe('Test the playlists path', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');
    let playlistData = {
      title: "Runnin' fo fun"
    }
    await database('playlists').insert(playlistData);
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
  });

  describe('test playlists deletion', () => {
    it('happy path', async () => {
      const playlist = await database('playlists').first()
      expect(playlist.title).toBe("Runnin' fo fun");

      const res = await request(app)
        .delete(`/api/v1/playlists/${playlist.id}`)

      expect(res.statusCode).toBe(204);

      const playlists = await database('playlists').select()
      expect(playlists.length).toBe(0);
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
});
