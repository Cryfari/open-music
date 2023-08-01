exports.up = (pgm) => {
  pgm.createTable('covers', {
    cover_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    filename: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.addConstraint(
      'covers',
      'unique_album_id_and_filename',
      'UNIQUE(album_id, filename)',
  );

  pgm.addConstraint(
      'covers',
      'fk_covers.album_id_albums.album_id',
      'FOREIGN KEY(album_id) REFERENCES albums(album_id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {};
