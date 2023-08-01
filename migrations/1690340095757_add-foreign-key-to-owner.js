exports.up = (pgm) => {
  pgm.addConstraint(
      'playlists',
      'fk_playlists.owner_users.user_id',
      'FOREIGN KEY(owner) REFERENCES users(user_id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.user_id');
};
