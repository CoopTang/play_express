const express = require('express');
const router  = express.Router();
const playlistsController = require('../../../controllers/playlistsController')
const favoritesController = require('../../../controllers/playlists/favoritesController')

router.get('/', playlistsController.index);
router.post('/', playlistsController.create);
router.put('/:id', playlistsController.update);
router.delete('/:id', playlistsController.destroy);

router.post('/:playlist_id/favorites/:favorite_id', favoritesController.create)
router.delete('/:playlist_id/favorites/:favorite_id', favoritesController.destroy)

module.exports = router
