const Favorite = require('../models/favorite')
const musixMatchService = require('../services/musix_match_service')

const index = (request, response) => {
  Favorite.all()
    .then((favorites) => {
      response.status(200).json(favorites);
    })
    .catch((error) => {
      response.status(500).json({ error });
    })
}

const create = async (req, res) => {
  const title  = req.body.title;
  const artist = req.body.artistName;
  let musix = await musixMatchService.getTracks(title, artist);
  musix.message.body ? createFavorite(res, musix) : invalidResponse(res);
}

async function createFavorite(response, musix) {
  Favorite.create(favoriteParams(musix.message.body.track))
  .then(favorite => {
    response.status(201).json(favorite[0]);
  })
  .catch(error => {
    response.status(500).json({ error });
  })
}

async function invalidResponse(response) {
  response.status(400).json({ message: "Invalid request body" })
}

const favoriteParams = (params) => {
  return {
    title: params.track_name,
    artistName: params.artist_name,
    genre: params.primary_genres.music_genre_list[0].music_genre.music_genre_name,
    rating: params.track_rating
  }
}

module.exports = {
  index,
  create
}