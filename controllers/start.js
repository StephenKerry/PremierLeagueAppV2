'use strict';

import logger from "../utils/logger.js";
import appStore from "../models/app-store.js";

const start = {

  createView(request, response) {
    const info = appStore.getAppInfo();
    logger.debug(info);
    
    logger.info("Start page loading!")
    response.json(info);   
  },
};

export default start;
