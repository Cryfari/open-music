const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
/**
 * likes sevice
 */
class LikesService {
  /**
   * constructor
   * @param {service} cacheService
   */
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  /**
   * @param {string} albumId
   * @param {string} userId
   */
  async addLike(albumId, userId) {
    await this.verifyAlbum(albumId);
    await this.verifyLike(albumId, userId);
    const id = `like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING like_id',
      values: [id, userId, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Like gagal ditambahkan');
    }
    await this._cacheService.delete(`likes:${albumId}`);
  }

  /**
   * @param {string} albumId
   * @param {string} userId
   */
  async deleteLike(albumId, userId) {
    const query = {
      text: `DELETE FROM user_album_likes
              WHERE user_id = $1 AND album_id = $2
              RETURNING like_id`,
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Like gagal dihapus');
    }
    await this._cacheService.delete(`likes:${albumId}`);
  }

  /**
   * @param {string} albumId
   */
  async getLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return [JSON.parse(result), true];
    } catch (error) {
      const query = {
        text: `SELECT COUNT(user_id) AS likes
                FROM user_album_likes
                WHERE album_id = $1`,
        values: [albumId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(
          `likes:${albumId}`, JSON.stringify(result.rows[0].likes),
      );
      return [result.rows[0].likes, false];
    }
  }

  /**
   * @param {string} albumId
   * @param {string} userId
   */
  async verifyLike(albumId, userId) {
    const query = {
      text: `SELECT * FROM user_album_likes
              WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('like sudah ada');
    }
  }

  /**
   * @param {string} albumId
   */
  async verifyAlbum(albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
}

module.exports = LikesService;
