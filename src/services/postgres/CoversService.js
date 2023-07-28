const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
/**
 * cover service
 */
class CoversService {
  /**
   * constructor
   * @param {service} storageService
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * menambahkan cover
   * @param {string} filename
   * @param {string} albumId
   */
  async addCover(filename, albumId) {
    const id = `cover-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO covers VALUES($1, $2, $3) RETURNING cover_id',
      values: [id, albumId, filename],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].cover_id) {
      throw new InvariantError('Cover gagal ditambahkan');
    }
  }

  /**
   * @param {string} albumId
   */
  async getCover(albumId) {
    const query = {
      text: 'SELECT * FROM covers WHERE album_id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return null;
    }
    return result.rows[0].filename;
  }

  /**
   * @param {string} newFilename
   * @param {string} albumId
   */
  async updateCover(newFilename, albumId) {
    const query = {
      text: `UPDATE covers
              SET filename = $1 WHERE album_id = $2
              RETURNING cover_id`,
      values: [newFilename, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Cover gagal diperbarui');
    }
  }
}

module.exports = CoversService;
