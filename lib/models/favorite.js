const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('favorites')
  .select()

const find = (id) => database('favorites').where("id", id).first()

const create = (favoriteParams) => database('favorites')
  .returning(['id', 'title', 'artistName', 'genre', 'rating'])
  .insert(favoriteParams)

const destroy = (favoriteId) => database('favorites')
  .where('id', favoriteId)
  .del()


module.exports = {
  all,
  create,
  find,
  destroy
}