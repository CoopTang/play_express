// const Playlist = require('../../models/playlist')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

const index = (request, response) => {
}

const create = async (req, res) => {
  const playlist = await database('playlists').where({id: req.params.playlist_id}).first()
  console.log(playlist)
  const favorite = await database('favorites').where({id: req.params.favorite_id}).first()
  database('playlist_favorites')
    .insert({
      playlistId: playlist.id,
      favoriteId: favorite.id
    })
    .then(() =>{
      res.status(201).json({Success: `${favorite.title} has been added to ${playlist.title}`})
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: error})
    })
}

const destroy = async (req, res) => {
}


module.exports = {
  index,
  create,
  destroy
}
