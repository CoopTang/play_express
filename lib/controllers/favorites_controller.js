const Favorite = require('../models/favorite')

const index = (request, response) => {
  Favorite.all()
    .then((favorites) => {
      response.status(200).json(favorites)
    })
    .catch((error) => {
      response.status(500).json({ error });
    })
}

module.exports = {
  index
}