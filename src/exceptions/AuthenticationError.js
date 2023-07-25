const ClientError = require('./ClientError');

/**
 * AuthenticationError
 */
class AuthenticationError extends ClientError {
  /**
   * constructor
   * @param {string} message
   */
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;
