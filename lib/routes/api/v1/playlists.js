const express = require('express');
const router  = express.Router();
const favoritesController = require('../../../controllers/playlistsController')

router.get('/', favoritesController.index);
router.post('/', favoritesController.create);
router.put('/:id', favoritesController.update);
router.delete('/:id', favoritesController.destroy);

module.exports = router
