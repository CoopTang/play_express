const Playlist = require('../models/playlist')

const index = (request, response) => {
}

const create = async (req, res) => {
  Playlist.create({ title: req.body.title })
    .then(playlist => {
      res.status(201).json({ id: playlist[0].id,
                          title: playlist[0].title,
                      createdAt: playlist[0].created_at,
                      updatedAt: playlist[0].updated_at
                      });
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ error: error });
    })
}

const update = (req, res) => {
}

const destroy = async (req, res) => {
}

module.exports = {
  index,
  create,
  update,
  destroy
}
