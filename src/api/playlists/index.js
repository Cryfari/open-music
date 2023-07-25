/* eslint-disable max-len */
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, {service, validatorPlaylist, validatorSong}) => {
    const playlistsHandler = new PlaylistsHandler(
        service, validatorPlaylist, validatorSong,
    );

    server.route(routes(playlistsHandler));
  },
};
