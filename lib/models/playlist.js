const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('playlists')
  .select()

const allWithFavorites = () => database('playlists')
  .select('playlists.id', 'playlists.title')
  .join('playlist_favorites', {'playlists.id': 'playlistId'})
  .join('favorites', {'favorites.id': 'favoriteId'})
  .count('favoriteId as songCount')
  .avg('rating as songAvgRating')
  .groupBy('playlists.id')
  .then(playlists => {
    playlists.forEach(playlist => {
      database('playlist_favorites')
        .where({playlistId: playlist.id})
        .join('favorites', {'favoriteId': 'favorites.id'})
        .select(
          'favorites.id',
          'favorites.title',
          'favorites.artistName',
          'favorites.genre',
          'favorites.rating'
        )
        .then(favorites => {
          // console.log(favorites)
          playlist.favorites = favorites
        })
    })
  })

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
