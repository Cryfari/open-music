const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

/**
 * Service untuk menangani resource users
 */
class UsersService {
  /**
   * constructor
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {string} username
   */
  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError('Username sudah digunakan');
    }
  }

  /**
   * @param {string} username
   * @param {string} password
   * @param {string} fullname
   */
  async addUser({username, password, fullname}) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING user_id',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].user_id;
  }

  /**
   * @param {string} userId
   */
  async getUserById(userId) {
    const query = {
      text: 'SELECT user_id, username, fullname FROM users WHERE user_id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return result.rows[0];
  }

  /**
   * verifikasi user credential
   * @param {string} username
   * @param {string} password
   */
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT user_id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const {user_id: userId, password: hashedPassword} = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return userId;
  }
}

module.exports = UsersService;
