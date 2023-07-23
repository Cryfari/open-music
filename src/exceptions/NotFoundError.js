const ClientError = require('./ClientError');

/**
 * custom error
 */
class NotFoundError extends ClientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
module.exports = NotFoundError;

