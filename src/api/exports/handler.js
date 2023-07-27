const autoBind = require('auto-bind');

/**
 * export handler
 */
class ExportsHandler {
  /**
   * @param {service} producerService
   * @param {service} playlistsService
   * @param {validator} validator
   */
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * handler export playlist by id
   * @param {object} request
   * @param {object} h
   */
  async postExportPlaylistByIdHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const {id: credentialId} = request.auth.credentials;
    const {playlistId} = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._producerService.sendMessage(
        'export:playlist', JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
