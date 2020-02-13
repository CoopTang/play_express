const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

var types = require('pg').types
types.setTypeParser(20, function(val) {
  return parseInt(val)
})

const all = () => database('playlists')
  .select()

const allWithFavorites = () => database('playlists')
  .select(
    'playlists.id',
    'playlists.title',
    'playlists.created_at',
    'playlists.updated_at'
  )
  .leftJoin('playlist_favorites', {'playlists.id': 'playlistId'})
  .leftJoin('favorites', {'favorites.id': 'favoriteId'})
  .count('favoriteId as songCount')
  .avg('rating as songAvgRating')
  .groupBy('playlists.id')

const find = (id) => database('playlists')
  .where("id", id)
  .first()

const create = (playlistParams) => database('playlists')
  .returning(['id', 'title', 'created_at', 'updated_at'])
  .insert(playlistParams)

const update = (id, playlistParams) => database('playlists')
  .where('id', id)
  .update(playlistParams, ['id', 'title', 'created_at', 'updated_at'])

const destroy = (playlistId) => database('playlists')
  .where('id', playlistId)
  .del()



module.exports = {
  all,
  allWithFavorites,
  create,
  update,
  find,
  destroy
}
