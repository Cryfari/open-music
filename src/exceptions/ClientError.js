
/**
 * custom error
 */
class ClientError extends Error {
  /**
   * @param {string} message
   * @param {integer} statusCode
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
