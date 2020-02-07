const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('playlist')
  .select()

const find = (id) => database('playlist')
  .where("id", id)
  .first()

const create = (favoriteParams) => database('playlist')
  .insert(favoriteParams)

const destroy = (favoriteId) => database('playlist')
  .where('id', favoriteId)
  .del()


module.exports = {
  all,
  create,
  find,
  destroy
}