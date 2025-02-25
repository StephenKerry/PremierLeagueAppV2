'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const TeamsStore = {

  store: new TeamsStore('./models/playlist-store.json', { playlistCollection: [] }),
  collection: 'EPL Teams',
  array: 'teams',

  getAllPlaylists() {
    return this.store.findAll(this.collection);
  },

};

export default TeamsStore;
