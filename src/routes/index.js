import express from 'express';
import config from '../config'; // go up one directory level
import middleware from '../middleware';
import initializeDB from '../db';
import foodtruck from '../controller/foodtruck';
import account from '../controller/account';

let router = express();

// connect to DB
initializeDB(db => {
  // internal middleware
  router.use(middleware({ config, db }))

  // api routes v1 (/v1)
  router.use('/foodtruck', foodtruck({ config, db }));
  router.use('/account', account({ config, db }));
});

export default router;
