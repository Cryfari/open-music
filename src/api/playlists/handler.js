const autoBind = require('auto-bind');

/**
 * Playlists Handler
 */
class PlaylistsHandler {
  /**
   * constructor
   * @param {service} Service
   * @param {validator} validatorPlaylist
   * @param {validator} validatorSong
   */
  constructor(Service, validatorPlaylist, validatorSong) {
    this._service = Service;
    this._validatorPlaylist = validatorPlaylist;
    this._validatorSong = validatorSong;

    autoBind(this);
  }

  /**
   * @param {object} request
   * @param {object} h
   */
  async postPlaylistHandler(request, h) {
    this._validatorPlaylist.validatePlaylistPayload(request.payload);
    const {name} = request.payload;
    const {id: credentialId} = request.auth.credentials;
    const playlistId = await this._service.addPlaylist(name, credentialId);
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * @param {object} request
   */
  async getPlaylistsHandler(request) {
    const {id: credentialId} = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  /**
   * @param {object} request
   */
  async deletePlaylistByIdHandler(request) {
    const {id} = request.params;
    const {id: credentialId} = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  /**
   * @param {object} request
   * @param {object} h
   */
  async postSongToPlaylistHandler(request, h) {
    this._validatorPlaylist.validatePlaylistSongPayload(request.payload);
    const {songId} = request.payload;
    const {id: credentialId} = request.auth.credentials;
    const {id: playlistId} = request.params;
    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.addSongToPlaylist(playlistId, songId);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  /**
   * @param {object} request
   */
  async getSongsFromPlaylistHandler(request) {
    const {id: credentialId} = request.auth.credentials;
    const {id: playlistId} = request.params;
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._service.getSongsFromPlaylist(playlistId);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  /**
   * @param {object} request
   */
  async deleteSongFromPlaylistHandler(request) {
    this._validatorPlaylist.validatePlaylistSongPayload(request.payload);
    const {songId} = request.payload;
    const {id: credentialId} = request.auth.credentials;
    const {id: playlistId} = request.params;
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongFromPlaylist(playlistId, songId);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;
