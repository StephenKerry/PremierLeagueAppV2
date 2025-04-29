'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const userStore = {
  store: new JsonStore('./models/user-store.json', { users: [] }),
  collection: 'users',

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, (user) => user.id === id);
  },

  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, (user) => user.email === email);
  },

  async addUser(user, picture) {
    try {
      
      const imageUrl = await this.store.uploader({ picture });

      
      user.picture = imageUrl;

      
      await this.store.addCollection(this.collection, user);

      logger.info(`User ${user.email} registered successfully`);
    } catch (err) {
      logger.error('Failed to register user with image:', err);
      throw new Error('Registration failed');
    }
  },
};

export default userStore;
