/* eslint-disable max-len */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('songs', 'fk_songs.albumId_albums.album_id', 'FOREIGN KEY("albumId") REFERENCES albums(album_id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.albumId_albums.album_id');
};
