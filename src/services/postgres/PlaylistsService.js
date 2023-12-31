const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const {mapDBToModelPlaylist, mapDBToModelSong} = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * PlaylistsService
 */
class PlaylistsService {
  /**
   * constructor
   * @param {CollaborationsService} collaborationsService
   */
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  /**
   * @param {string} name
   * @param {string} owner
   */
  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING playlist_id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0].playlist_id;
  }

  /**
   * @param {string} owner
   */
  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.playlist_id, playlists.name, users.username 
      FROM playlists 
      LEFT JOIN users
      ON users.user_id = playlists.owner 
      LEFT JOIN collaborations
      ON collaborations.playlist_id = playlists.playlist_id 
      WHERE collaborations.user_id = $1 OR playlists.owner = $1;`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelPlaylist);
  }

  /**
   * @param {string} playlistId
   */
  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT playlists.playlist_id, playlists.name,
      users.username,
      songs.song_id, songs.title, songs.performer 
      FROM playlists 
      INNER JOIN users 
      ON playlists.owner = users.user_id 
      INNER JOIN playlist_songs 
      ON playlist_songs.playlist_id = $1
      INNER JOIN songs 
      ON songs.song_id = playlist_songs.song_id
      WHERE playlists.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return {
      id: result.rows[0].playlist_id,
      name: result.rows[0].name,
      username: result.rows[0].username,
      songs: result.rows.map(mapDBToModelSong),
    };
  }

  /**
   * @param {string} id
   */
  async getPlaylistById(id) {
    const query = {
      text: `SELECT playlists.playlist_id, playlists.name, users.username
              FROM playlists
              LEFT JOIN users
              ON users.user_id = playlists.owner
              WHERE playlists.playlist_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result.rows.map(mapDBToModelPlaylist)[0];
  }

  /**
   * @param {string} id
   */
  async deletePlaylistById(id) {
    const query = {
      text: `DELETE FROM playlists
              WHERE playlist_id = $1 
              RETURNING playlist_id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  /**
   * @param {string} playlistId
   * @param {string} songId
   */
  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: `DELETE FROM playlist_songs
              WHERE playlist_id = $1 AND song_id = $2
              RETURNING playlist_song_id`,
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError(
          'Lagu gagal dihapus dari playlist. Id tidak ditemukan',
      );
    }
  }

  /**
   * @param {string} playlistId
   * @param {string} songId
   */
  async addSongToPlaylist(playlistId, songId) {
    try {
      const id = `playlistsongs-${nanoid(16)}`;
      const query = {
        text: `INSERT INTO playlist_songs
                VALUES($1, $2, $3)
                RETURNING playlist_song_id`,
        values: [id, playlistId, songId],
      };
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new InvariantError('Lagu gagal ditambahkan ke playlist');
      }
    } catch (error) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  /**
   * @param {string} id
   * @param {string} owner
   */
  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE playlist_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  /**
   * @param {string} playlistId
   * @param {string} userId
   */
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(
            playlistId, userId,
        );
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
