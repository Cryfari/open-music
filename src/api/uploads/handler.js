const autoBind = require('auto-bind');

/**
 * Uploads Handler
 */
class UploadsHandler {
  /**
   * @param {service} storageService
   * @param {service} coversService
   * @param {validator} validator
   */
  constructor(storageService, coversService, validator) {
    this._storageService = storageService;
    this._coversService = coversService;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * Upload Image Handler
   * @param {Object} request
   * @param {Object} h
   */
  async postUploadImageHandler(request, h) {
    const {id} = request.params;
    const {cover} = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const coverIsExist = await this._coversService.getCover(id);

    const filename = +new Date() + cover.hapi.filename;

    if (coverIsExist) {
      await this._storageService.deleteFile(coverIsExist);
      await this._coversService.updateCover(
          filename, id,
      );
    } else {
      await this._coversService.addCover(filename, id);
    }

    await this._storageService.writeFile(cover, filename);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
