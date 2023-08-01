const autoBind = require('auto-bind');

/**
 * handler albums
 */
class AlbumsHandler {
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
   * @return {response} response
   */
  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const albumId = await this._service.addAlbum(request.payload);
    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId: albumId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * @param {request} request
   * @param {any} h
   * @return {response} response
   */
  async getAlbumByIdHandler(request, h) {
    const {id} = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album: album,
      },
    };
  }

  /**
   * @param {request} request
   * @return {response} response
   */
  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const {id} = request.params;
    await this._service.editAlbumById(id, request.payload);
    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  /**
   * @param {request} request
   * @return {response} response
   */
  async deleteAlbumByIdHandler(request) {
    const {id} = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
