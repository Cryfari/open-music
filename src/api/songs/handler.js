const autoBind = require('auto-bind');

/**
 * handler albums
 */
class SongsHandler {
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
  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const songId = await this._service.addSong(request.payload);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId: songId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * @param {request} request
   * @return {response} response
   */
  async getSongsHandler(request) {
    const songs = await this._service.getSongs(request.query);
    return {
      status: 'success',
      data: {
        songs: songs,
      },
    };
  }

  /**
   * @param {request} request
   * @return {response} response
   */
  async getSongByIdHandler(request) {
    const {id} = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song: song,
      },
    };
  }

  /**
   * @param {request} request
   * @return {response} response
   */
  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const {id} = request.params;
    await this._service.editSongById(id, request.payload);
    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  /**
   * @param {request} request
   * @return {response} response
   */
  async deleteSongByIdHandler(request) {
    const {id} = request.params;
    await this._service.deleteSongById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
