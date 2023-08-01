exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    like_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
      'user_album_likes',
      'unique_user_id_and_album_id',
      'UNIQUE(user_id, album_id)',
  );

  pgm.addConstraint(
      'user_album_likes',
      'fk_user_album_likes.user_id_users.user_id',
      'FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
      'user_album_likes',
      'fk_user_album_likes.album_id_albums.album_id',
      'FOREIGN KEY(album_id) REFERENCES albums(album_id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
