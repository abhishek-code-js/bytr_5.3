let { DataTypes, sequelize } = require('../lib/index.js');

let track = sequelize.define('track', {
  name: DataTypes.TEXT,
  genre: DataTypes.TEXT,
  release_year: DataTypes.INTEGER,
  artist: DataTypes.TEXT,
  album: DataTypes.TEXT,
  duration: DataTypes.INTEGER,
});

module.exports = {
  track,
};
