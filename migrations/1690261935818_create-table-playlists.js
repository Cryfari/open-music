/* eslint-disable max-len */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    playlist_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      foreignKey: {
        name: 'fk_playlists.owner_users.user_id',
        table: 'users',
        mapping: 'user_id',
        onDelete: 'CASCADE',
      },
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
