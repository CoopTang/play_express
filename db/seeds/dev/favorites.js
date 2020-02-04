
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('favorites').del()
    .then(function () {
      // Inserts seed entries
      return knex('favorites').insert([
        {id: 1, title: 'Take On Me', artistName: 'a-ha', rating: 87, genre: 'Pop'},
        {id: 2, title: 'Coming Home', artistName: 'Leon Bridges', rating: 90, genre: 'Soul'},
        {id: 3, title: 'Africa', artistName: 'Toto', rating: 92},
        {id: 4, title: 'Fur Elise', artistName: 'Ludwig Van Beethoven'}
      ]);
    });
};
