/* eslint-disable max-len */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapDBToModel} = require('../../utils');

/**
 * service songs
 */
class SongsService {
  /**
   * constructor
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * untuk menambahkan lagu
   * @param {string} title
   * @param {integer} year
   * @param {string} genre
   * @param {string} performer
   * @param {integer} duration
   * @param {string} albumId
   * @return {string} song_id
   */
  async addSong({title, year, genre, performer, duration, albumId}) {
    const id = 'song-' + nanoid(16);

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING song_id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].song_id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].song_id;
  }

  /**
   * mengambil semua lagu
   * @return {array} songs
   */
  async getSongs({title = null, performer = null}) {
    let query = {
      text: 'SELECT song_id, title, performer FROM songs',
    };
    if (title || performer) {
      query = {
        text: 'SELECT song_id, title, performer FROM songs WHERE LOWER(title) LIKE LOWER($1) OR LOWER(performer) LIKE LOWER($2)',
        values: [`%${title}%`, `%${performer}%`],
      };
    }
    if (title && performer) {
      query = {
        text: 'SELECT song_id, title, performer FROM songs WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)',
        values: [`%${title}%`, `%${performer}%`],
      };
    }
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  /**
   * mengambil lagu dengan id
   * @param {string} id
   * @return {array} song
   */
  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE song_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  /**
   * edit note dengan id
   * @param {string} id
   * @param {string} title
   * @param {integer} year
   * @param {string} genre
   * @param {string} performer
   * @param {integer} duration
   * @param {string} albumId
   */
  async editSongById(id, {title, year, genre, performer, duration = null, albumId = null}) {
    const query = {
      text: 'UPDATE songs '+
        'SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE song_id = $7 '+
        'RETURNING song_id',
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Lagu. Id tidak ditemukan');
    }
  }

  /**
   * menghapus lagu dengan id
   * @param {string} id
   */
  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE song_id = $1 RETURNING song_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
