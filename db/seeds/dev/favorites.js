
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('favorites').del()
    .then(function () {
      // Inserts seed entries
      return knex('favorites').insert([
        { title: 'Take On Me', artistName: 'a-ha', rating: 87, genre: 'Pop' },
        { title: 'Coming Home', artistName: 'Leon Bridges', rating: 90, genre: 'Soul' },
        { title: 'Africa', artistName: 'Toto', rating: 92 },
        { title: 'Fur Elise', artistName: 'Ludwig Van Beethoven' }
      ]);
    });
};
