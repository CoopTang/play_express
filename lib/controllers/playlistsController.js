const Playlist = require('../models/playlist')

const index = (request, response) => {
}

const create = async (req, res) => {
  if (req.body.title) {
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
  } else {
    res.status(400).json({ message: "Invalid request body" })
  }
}

const update = (req, res) => {
  isNaN(req.params.id) ? invalidQueryId(res) : updatePlaylist(req, res);
}

const destroy = async (req, res) => {
}

// ==============
// HELPER METHODS
// ==============

async function invalidQueryId(response) {
  response.status(500).json({ message: "ID must be a number!" });
}

async function updatePlaylist(req, res) {
  const params = sanitizeParams(req.body)
  params.title ? validBodyResponse(req.params.id, res, params)
               : invalidBodyResponse(res);
}

const sanitizeParams = (params) => {
  return {
    title: params.title
  }
}

async function invalidBodyResponse(res) {
  res.status(500).json({ message: "Invalid request body" })
}

async function validBodyResponse(id, res, params) {
  Playlist.update(id, params)
    .then(playlist => {
      playlist[0] ? res.status(200).json(formatPayload(playlist[0]))
                  : res.status(404).json(noRecordResponse());
    })
    .catch(error => {
      res.status(500).json({error});
    })
}

const formatPayload = (playlist) => {
  return {
    id: playlist.id,
    title: playlist.title,
    createdAt: playlist.created_at,
    updatedAt: playlist.updated_at
  }
}

const noRecordResponse = () => {
  return { message: "Playlist with that ID does not exist!" }
}


module.exports = {
  index,
  create,
  update,
  destroy
}
