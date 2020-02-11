exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('playlist_favorites', function(table) {
      table.increments('id').primary();
      table.integer('playlistId').unsigned();
      table.foreign('playlistId').references("playlists.id")
      table.integer('favoriteId').unsigned();
      table.foreign('favoriteId').references("favorites.id")

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('playlist_favorites')
  ]);
}
