/* eslint-disable camelcase */
const mapDBToModel = ({
  song_id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id: song_id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

const mapDBToModelPlaylist = ({
  playlist_id,
  name,
  username,
}) => ({
  id: playlist_id,
  name,
  username,
});
const mapDBToModelSong = ({
  song_id,
  title,
  performer,
}) => ({
  id: song_id,
  title,
  performer,
});

module.exports = {mapDBToModel, mapDBToModelPlaylist, mapDBToModelSong};
