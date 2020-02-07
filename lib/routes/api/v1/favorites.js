const express = require('express');
const router  = express.Router();
const favoritesController = require('../../../controllers/favoritesController')

router.get('/', favoritesController.index);
router.get('/:id', favoritesController.show);
router.post('/', favoritesController.create);
router.delete('/:id', favoritesController.destroy);

module.exports = router
