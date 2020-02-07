const Favorite = require('../models/favorite')
const musixMatchService = require('../services/musix_match_service')

const index = (request, response) => {
  Favorite.all()
    .then((favorites) => {
      favorites.forEach(favorite => formatPayload(favorite));
      response.status(200).json(favorites);
    })
    .catch((error) => {
      response.status(500).json({ error });
    })
}

const show = (req, res) => {
  isNaN(req.params.id) ? invalidQueryId(req, res) : showFavorite(req, res);
}

const create = async (req, res) => {
  const title  = req.body.title;
  const artist = req.body.artistName;
  let musix = await musixMatchService.getTracks(title, artist);
  musix.message.body ? createFavorite(res, musix) : invalidResponse(res);
}

const destroy = async (req, res) => {
  isNaN(req.params.id) ? invalidQueryId(req, res) : deleteFavorite(req, res);
  // favoriteId = req.params.id
  // Favorite.destroy(req.params.id)
  //   .then((deleted) => { 
  //     deleted ? res.status(204).send() 
  //             : res.status(404).send(noRecordResponse());
  //   })
  //   .catch(error => {
  //     res.status(500).json({ error }); 
  //   })
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

const noRecordResponse = () => {
  return { message: "Favorite with that ID does not exist!" }
}

async function invalidQueryId(request, response) {
  response.status(500).json({ message: "ID must be a number!" });
}

async function showFavorite(request, response) {
  Favorite.find(request.params.id)
    .then((favorite) => {
      favorite ? response.status(200).json(formatPayload(favorite))
               : response.status(404).json(noRecordResponse());
    })
    .catch((error) => {
      response.status(404).json({ error });
    })
}

async function deleteFavorite(request, response) {
  Favorite.destroy(request.params.id)
    .then((deleted) => { 
      deleted ? response.status(204).send() 
              : response.status(404).send(noRecordResponse());
    })
    .catch(error => {
      response.status(500).json({ error }); 
    })
}

const favoriteParams = (params) => {
  return {
    title: params.track_name,
    artistName: params.artist_name,
    genre: params.primary_genres.music_genre_list[0].music_genre.music_genre_name,
    rating: params.track_rating
  }
}

const formatPayload = (favorite) => {
  delete favorite.created_at;
  delete favorite.updated_at;
  return favorite;
}

module.exports = {
  index,
  show,
  create,
  destroy
}