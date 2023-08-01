const autoBind = require('auto-bind');

/**
 * Playlists Handler
 */
class PlaylistsHandler {
  /**
   * constructor
   * @param {service} activitiesService
   * @param {service} playlistService
   * @param {validator} validatorPlaylist
   * @param {validator} validatorSong
   */
  constructor(
      activitiesService,
      playlistService,
      validatorPlaylist,
      validatorSong,
  ) {
    this._activitiesService = activitiesService;
    this._playlistsService = playlistService;
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
    const playlistId = await this._playlistsService.addPlaylist(
        name,
        credentialId,
    );
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
    const playlists = await this._playlistsService.getPlaylists(credentialId);
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
    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylistById(id);
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
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsService.addSongToPlaylist(playlistId, songId);
    await this._activitiesService.addActivity(
        playlistId,
        songId,
        credentialId,
        'add',
    );
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
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._playlistsService.getSongsFromPlaylist(
        playlistId,
    );
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
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsService.deleteSongFromPlaylist(playlistId, songId);
    await this._activitiesService.addActivity(
        playlistId,
        songId,
        credentialId,
        'delete',
    );
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  /**
   * @param {request} request
   */
  async getActivitiesFromPlaylistHandler(request) {
    const {id: credentialId} = request.auth.credentials;
    const {id: playlistId} = request.params;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._activitiesService.getActivities(playlistId);
    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
