'use strict';

const router = require('express').Router();
const ctlrsUsr = require('./controllers/users');

/* USER CREATION & VALIDATION */
router.post('/userSingup', ctlrsUsr.createUser);
router.post('/userLogin', ctlrsUsr.userLogin);

/* MANAGING FAVOURITES */
router.post('/favourite', ctlrsUsr.addFavourite);
router.get('/favouriteIDs', ctlrsUsr.getFavouritesIDs);
router.delete('/favourite', ctlrsUsr.deleteFavourite);

module.exports = router;