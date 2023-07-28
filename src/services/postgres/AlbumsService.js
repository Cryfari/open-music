const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const config = require('../../utils/config');

/**
 * service albums
 */
class AlbumsService {
  /**
   * constructor
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * menambahkan album
   * @param {string} name
   * @param {integer} year
   */
  async addAlbum({name, year}) {
    const id = 'album-' + nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING album_id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].album_id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].album_id;
  }

  /**
   * mendapatkan album berdasarkan id
   * @param {string} id
   */
  async getAlbumById(id) {
    const queryAlbum = {
      text: `SELECT albums.*, covers.filename 
              FROM albums 
              LEFT JOIN covers ON albums.album_id = covers.album_id WHERE 
              albums.album_id = $1`,
      values: [id],
    };
    const resultAlbum = await this._pool.query(queryAlbum);
    if (!resultAlbum.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    const querySongs = {
      text: 'SELECT song_id, title, performer FROM songs WHERE "albumId" = $1',
      values: [id],
    };
    const resultSongs = await this._pool.query(querySongs);

    return {
      id: resultAlbum.rows[0].album_id,
      name: resultAlbum.rows[0].name,
      year: resultAlbum.rows[0].year,
      coverUrl: resultAlbum.rows[0].filename?`http://${config.app.host}:${config.app.port}/albums/images/${resultAlbum.rows[0].filename}` : null,
      songs: resultSongs.rows[0]?.song_id ? resultSongs.rows.map((song) => ({
        id: song.song_id,
        title: song.title,
        performer: song.performer,
      })) : [],
    };
  }

  /**
   * mengubah album berdasarkan id
   * @param {string} id
   * @param {string} name
   * @param {integer} year
   */
  async editAlbumById(id, {name, year}) {
    const query = {
      text: 'UPDATE albums '+
        'SET name = $1, year = $2 WHERE album_id = $3 '+
        'RETURNING album_id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  /**
   * menghapus note dengan id
   * @param {string} id
   */
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE album_id = $1 RETURNING album_id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
