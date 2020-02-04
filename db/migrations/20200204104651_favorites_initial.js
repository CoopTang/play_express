exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('favorites', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('artist_name');
      table.string('genre').notNullable().defaultTo('Unknown');
      table.integer('rating').notNullable().defaultTo(0);

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('favorites')
  ]);
}
