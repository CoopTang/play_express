const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

var types = require('pg').types
types.setTypeParser(20, function(val) {
  return parseInt(val)
})

const all = () => database('playlists')
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

const create = (playlistParams) => database('playlists')
  .returning(['id', 'title', 'created_at', 'updated_at'])
  .insert(playlistParams)

const update = (id, playlistParams) => database('playlists')
  .where('id', id)
  .update(playlistParams, ['id', 'title', 'created_at', 'updated_at'])

const destroy = (playlistId) => database('playlists')
  .where('id', playlistId)
  .del()

const find = (id) => database('playlists').where("id", id).first()

const getPlaylistFavorites = (playlistId) => database('playlist_favorites')
  .select('favorites.id', 'favorites.title', 'favorites.artistName', 'favorites.genre', 'favorites.rating')
  .join('favorites', { 'favorites.id': 'playlist_favorites.favoriteId'})
  .where({ playlistId: playlistId })
  .groupBy('favorites.id')

const getAvgRating = (playlistId) => database('playlist_favorites')
  .join('favorites', { 'favorites.id': 'playlist_favorites.favoriteId'})
  .where({ playlistId: playlistId })
  .avg('favorites.rating as songAvgRating')

async function formattedPlaylistInfo(playlistId) {
  try {
    let results = Promise.all([
      find(playlistId),
      getAvgRating(playlistId),
      getPlaylistFavorites(playlistId),
    ]);

    let [playlist, avgRating, favorites] = await results;

    return {
      id: playlist.id,
      title: playlist.title,
      songCount: favorites.length,
      songAvgRating: parseFloat(avgRating[0].songAvgRating),
      favorites: favorites,
      createdAt: playlist.created_at,
      updatedAt: playlist.updated_at
    }
  } catch(error) {
    return error;
  }
}


module.exports = {
  all,
  create,
  update,
  find,
  destroy,
  getPlaylistFavorites,
  getAvgRating,
  formattedPlaylistInfo
}
