const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('playlists')
  .select()

const find = (id) => database('playlists')
  .where("id", id)
  .first()

const create = (playlistParams) => database('playlists')
  .returning(['id', 'title', 'created_at', 'updated_at'])
  .insert(playlistParams)

const destroy = (playlistId) => database('playlists')
  .where('id', playlistId)
  .del()


module.exports = {
  all,
  create,
  find,
  destroy
}
