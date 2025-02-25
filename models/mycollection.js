'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const teamsCollection = {

  store: new JsonStore('./models/mycollection.json', { teamsCollection: [] }),
  collection: 'teams',
  array: 'teams',

  getAllTeams() {
    return this.store.findAll(this.collection);
  },

};

export default teamsCollection;