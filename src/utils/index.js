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

module.exports = {mapDBToModel};
