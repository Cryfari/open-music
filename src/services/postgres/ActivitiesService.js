/* eslint-disable max-len */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

/**
 *  ActivitiesService
 */
class ActivitiesService {
  /**
   * constructor
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {string} playlistId
   */
  async getActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time FROM playlist_song_activities INNER JOIN songs ON songs.song_id = playlist_song_activities.song_id INNER JOIN users ON users.user_id = playlist_song_activities.user_id WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Aktivitas tidak ditemukan');
    }

    return result.rows;
  }

  /**
   * @param {string} playlistId
   * @param {string} songId
   * @param {string} userId
   * @param {string} action
   */
  async addActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING activity_id',
      values: [id, playlistId, songId, userId, action],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Aktivitas gagal ditambahkan');
    }
  }
}

module.exports = ActivitiesService;
