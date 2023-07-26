/* eslint-disable max-len */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    collaboration_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('collaborations', 'unique_playlist_id_and_user_id', 'UNIQUE(playlist_id, user_id)');
  pgm.addConstraint('users', 'unique_user_id', 'UNIQUE(user_id)');
  pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.playlist_id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.user_id', 'FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
  pgm.dropComstraint('users', 'unique_user_id');
};
