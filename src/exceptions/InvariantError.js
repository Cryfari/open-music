const ClientError = require('./ClientError');

/**
 * custom error
 */
class InvariantError extends ClientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 400);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
