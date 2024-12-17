const express = require('express');
const { resolve } = require('path');

let { track } = require('./models/track.model.js');
let { sequelize } = require('./lib/index.js');

const app = express();
const cors = require('cors');
app.use(cors());
const port = 3010;

let movieData = [
  {
    name: 'Raabta',
    genre: 'Romantic',
    release_year: 2012,
    artist: 'Arijit Singh',
    album: 'Agent Vinod',
    duration: 4,
  },
  {
    name: 'Naina Da Kya Kasoor',
    genre: 'Pop',
    release_year: 2018,
    artist: 'Amit Trivedi',
    album: 'Andhadhun',
    duration: 3,
  },
  {
    name: 'Ghoomar',
    genre: 'Traditional',
    release_year: 2018,
    artist: 'Shreya Ghoshal',
    album: 'Padmaavat',
    duration: 3,
  },
  {
    name: 'Tum Hi Ho',
    genre: 'Romantic',
    release_year: 2013,
    artist: 'Arijit Singh',
    album: 'Aashiqui 2',
    duration: 5,
  },
  {
    name: 'Gallan Goodiyan',
    genre: 'Party',
    release_year: 2015,
    artist: 'Various Artists',
    album: 'Dil Dhadakne Do',
    duration: 4,
  },
  {
    name: 'Zingaat',
    genre: 'Dance',
    release_year: 2016,
    artist: 'Ajay-Atul',
    album: 'Sairat',
    duration: 3,
  },
  {
    name: 'Channa Mereya',
    genre: 'Romantic',
    release_year: 2016,
    artist: 'Arijit Singh',
    album: 'Ae Dil Hai Mushkil',
    duration: 4,
  },
  {
    name: 'Mast Magan',
    genre: 'Romantic',
    release_year: 2014,
    artist: 'Arijit Singh & Chinmayi',
    album: '2 States',
    duration: 4,
  },
  {
    name: 'Badtameez Dil',
    genre: 'Party',
    release_year: 2013,
    artist: 'Benny Dayal',
    album: 'Yeh Jawaani Hai Deewani',
    duration: 3,
  },
  {
    name: 'Lungi Dance',
    genre: 'Party',
    release_year: 2013,
    artist: 'Yo Yo Honey Singh',
    album: 'Chennai Express',
    duration: 4,
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await track.bulkCreate(movieData);
    res.status(200).json({ message: 'Database seeding successful' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding the data', error: error.message });
  }
});

async function fetchAllTracks() {
  let tracks = await track.findAll();
  return { tracks };
}

app.get('/tracks', async (req, res) => {
  try {
    let response = await fetchAllTracks();

    if (response.tracks.length === 0) {
      res.status(404).json({ message: 'no tracks found' });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchTrackById(id) {
  let trackData = await track.findOne({ where: { id } });

  return { track: trackData };
}

app.get('/tracks/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await fetchTrackById(id);

    if (result.track == null) {
      return res.status(404).json({ message: 'No track with this id found' });
    }
    console.log(result);
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchTrackByArtist(artist) {
  let tracks = await track.findAll({ where: { artist } });

  return { tracks: tracks };
}

app.get('/tracks/artists/:artist', async (req, res) => {
  try {
    let artist = req.params.artist;
    let result = await fetchTrackByArtist(artist);

    if (result.tracks.length === 0) {
      return res
        .status(404)
        .json({ message: 'No track with this artist found' });
    }
    console.log(result);
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function sortTracksByReleaseYear(order) {
  let sortedTracks = await track.findAll({ order: [['release_year', order]] });
  return { tracks: sortedTracks };
}

app.get('/tracks/sort/release_year', async (req, res) => {
  try {
    let order = req.query.order;
    let result = await sortTracksByReleaseYear(order);
    if (result.tracks.length === 0) {
      return res
        .status(404)
        .json({ message: 'No track with this artist found' });
    }
    console.log(result);
    return res.status(200).json(result);
  } catch (error) {}
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
