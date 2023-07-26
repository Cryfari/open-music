/* eslint-disable max-len */
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, {activitiesService, playlistsService, validatorPlaylist, validatorSong}) => {
    const playlistsHandler = new PlaylistsHandler(
        activitiesService, playlistsService, validatorPlaylist, validatorSong,
    );

    server.route(routes(playlistsHandler));
  },
};
