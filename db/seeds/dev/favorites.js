
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('favorites').del()
    .then(function () {
      // Inserts seed entries
      return knex('favorites').insert([
        {id: 1, title: 'Take On Me', artist_name: 'a-ha', rating: 87, genre: 'Pop'},
        {id: 2, title: 'Coming Home', artist_name: 'Leon Bridges', rating: 90, genre: 'Soul'},
        {id: 3, title: 'Africa', artist_name: 'Toto', rating: 92}
        {id: 4, title: 'Fur Elise', artist_name: 'Ludwig Van Beethoven'}
      ]);
    });
};
