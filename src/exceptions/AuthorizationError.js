const ClientError = require('./ClientError');

/**
 * authorization error
 */
class AuthotizationError extends ClientError {
  /**
   * constructor
   * @param {string} message
   */
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthotizationError;
