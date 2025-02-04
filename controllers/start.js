'use strict';

import logger from "../utils/logger.js";
import appStore from "../models/app-store.js";

const start = {
  createView(request, response) {
    logger.info("Start page loading!");
    
    const viewData = {
      title: "Welcome to the Playlist app!",
      anotherMsg: "Just a test",
      info: appStore.getAppInfo()
    };
    
    logger.debug(viewData.info.message);
    
    response.render('start', viewData);   
  },
};

export default start;
