const redis = require('redis');
const config = require('../../utils/config');
/**
 * CacheService
 */
class CacheService {
  /**
   * constructor
   */
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  /**
   * set cache
   * @param {string} key
   * @param {string} value
   * @param {integer} expirationInSecond
   */
  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  /**
   * get cache
   * @param {string} key
   */
  async get(key) {
    const result = await this._client.get(key);
    if (result === null) {
      throw new Error('Cache tidak ditemukan');
    }
    return result;
  }

  /**
   * delete cache
   * @param {string} key
   */
  async delete(key) {
    return await this._client.del(key);
  }
}

module.exports = CacheService;
