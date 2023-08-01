const autoBind = require('auto-bind');

/**
 * likes handler
 */
class LikesHandler {
  /**
   * constructor
   * @param {service} service
   */
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  /**
   * @param {Object} request
   * @param {Object} h
   */
  async postLikeAlbumHandler(request, h) {
    const {id: albumId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    await this._service.addLike(albumId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Like berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  /**
   * @param {Object} request
   * @param {Object} h
   */
  async deleteLikeAlbumHandler(request, h) {
    const {id: albumId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    await this._service.deleteLike(albumId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Like berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  /**
   * @param {Object} request
   * @param {Object} h
   */
  async getLikesAlbumHandler(request, h) {
    const {id: albumId} = request.params;

    const likes = await this._service.getLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: parseInt(likes[0]),
      },
    });
    if (likes[1]) {
      response.header('X-Data-Source', 'cache');
    }
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
