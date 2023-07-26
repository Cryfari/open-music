/* eslint-disable max-len */
const autoBind = require('auto-bind');

/**
 * users handler
 */
class UsersHandler {
  /**
   * constructor
   * @param {service} service
   * @param {validator} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  /**
   * @param {request} request
   * @param {hapi} h
   */
  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const {username, password, fullname} = request.payload;
    const userId = await this._service.addUser({username, password, fullname});
    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
