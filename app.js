var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];

var favoritesRouter = require('./lib/routes/api/v1/favorites');
var playlistsRouter = require('./lib/routes/api/v1/playlists');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/favorites', favoritesRouter);
app.use('/api/v1/playlists', playlistsRouter);

module.exports = app;
