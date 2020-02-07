const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('playlists')
  .select()

const find = (id) => database('playlists')
  .where("id", id)
  .first()

const create = (playlistParams) => database('playlists')
  .insert(playlistParams)

const update = (id, playlistParams) => database('playlists')
  .where('id', id)
  .update(playlistParams, ['id', 'title', 'created_at', 'updated_at'])

const destroy = (favoriteId) => database('playlists')
  .where('id', favoriteId)
  .del()


module.exports = {
  all,
  create,
  update,
  find,
  destroy
}