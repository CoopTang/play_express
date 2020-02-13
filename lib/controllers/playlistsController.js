const Playlist = require('../models/playlist')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const index = (request, response) => {
  Playlist.all()
    .then(async playlists => {
      let i = 0
      for (i = 0; i < playlists.length; i++) {
        await database('playlist_favorites')
          .select(
            'favorites.id',
            'favorites.title',
            'favorites.artistName',
            'favorites.genre',
            'favorites.rating'
          )
          .where({playlistId: playlists[i].id})
          .join('favorites', {'favorites.id': 'playlist_favorites.favoriteId'})
          .then(favorites => {
            playlists[i] = formatPayload(playlists[i], favorites)
          })
      }
      response.status(200).json(playlists);
    })
    .catch((error) => {
      console.log(error)
      response.status(500).json({ error });
    })
}

const create = async (req, res) => {
  if (req.body.title) {
    Playlist.create({ title: req.body.title })
      .then(playlist => {
        res.status(201).json(createPayload(playlist[0]));
      })
      .catch(error => {
        console.log(error)
        res.status(400).json({ error: error });
      })
  } else {
    res.status(400).json({ message: "Invalid request body" })
  }
}

const update = (req, res) => {
  isNaN(req.params.id) ? invalidQueryId(res) : updatePlaylist(req, res);
}

const destroy = async (req, res) => {
  isNaN(req.params.id) ? invalidQueryId(res) : deletePlaylist(req, res);
}

// ==============
// HELPER METHODS
// ==============

async function invalidQueryId(response) {
  response.status(500).json({ message: "ID must be a number!" });
}

async function updatePlaylist(req, res) {
  const params = sanitizeParams(req.body)
  params.title ? validBodyResponse(req.params.id, res, params)
               : invalidBodyResponse(res);
}

async function deletePlaylist(req, res) {
  Playlist.destroy(req.params.id)
    .then((deleted) => {
      deleted ? res.status(204).send()
              : res.status(404).send(noRecordResponse());
    })
    .catch(error => {
      response.status(500).json({ error });
    })
}

const sanitizeParams = (params) => {
  return {
    title: params.title
  }
}

async function invalidBodyResponse(res) {
  res.status(500).json({ message: "Invalid request body" })
}

async function validBodyResponse(id, res, params) {
  Playlist.update(id, params)
    .then(playlist => {
      playlist[0] ? res.status(200).json(formatPayload(playlist[0]))
                  : res.status(404).json(noRecordResponse());
    })
    .catch(error => {
      res.status(500).json({error});
    })
}

const formatPayload = (playlist, favorites) => {
  return {
    id: playlist.id,
    title: playlist.title,
    songCount: playlist.songCount,
    songAvgRating: formatFloat(playlist.songAvgRating),
    favorites: favorites,
    createdAt: playlist.created_at,
    updatedAt: playlist.updated_at
  }
}
const createPayload = (playlist) => {
  return {
    id: playlist.id,
    title: playlist.title,
    createdAt: playlist.created_at,
    updatedAt: playlist.updated_at
  }
}

const noRecordResponse = () => {
  return { message: "Playlist with that ID does not exist!" }
}

const formatFloat = (float) => {
  return Number(Number(float).toString());
}



module.exports = {
  index,
  create,
  update,
  destroy
}
