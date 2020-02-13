// const Playlist = require('../../models/playlist')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

const index = (request, response) => {
}

const create = async (req, res) => {
  const playlistId = req.params.playlist_id
  const favoriteId = req.params.favorite_id

  if (isNaN(playlistId) || isNaN(favoriteId)) {
    return res.status(400).json({ message: "ID must be a number!" });
  }
  let playlist = await database('playlists')
    .where({id: playlistId}).first()
  let favorite = await database('favorites')
    .where({id: favoriteId}).first()

  if (favorite === undefined || playlist === undefined) {
    return res.status(404).json({ message: "Playlist or Favorite with that ID does not exist!"})
  } else {
    database('playlist_favorites')
      .insert({
        playlistId: playlist.id,
        favoriteId: favorite.id
      })
      .then(() =>{
        res.status(201).json({Success: `${favorite.title} has been added to ${playlist.title}!`})
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({error: error})
      })
  }
}

const destroy = async (req, res) => {
  const playlistId = req.params.playlist_id
  const favoriteId = req.params.favorite_id

  if (isNaN(playlistId) || isNaN(favoriteId)) {
    return res.status(400).json({ message: "ID must be a number!" });
  }
  let playlist = await database('playlists')
    .where({id: playlistId}).first()
  let favorite = await database('favorites')
    .where({id: favoriteId}).first()

  if (favorite === undefined || playlist === undefined) {
    return res.status(404).json({ message: "Playlist or Favorite with that ID does not exist!"})
  } else {
    database('playlist_favorites')
      .where({
        playlistId: playlist.id,
        favoriteId: favorite.id
      })
      .del()
      .then(() =>{
        res.status(204).json()
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({error: error})
      })
  }
}


async function invalidQueryId(response) {
  response.status(500).json({ message: "ID must be a number!" });
}


module.exports = {
  index,
  create,
  destroy
}
