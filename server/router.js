'use strict';

const router = require('express').Router();
const ctlrsRec = require('./controllers/recipes');
const ctlrsUsr = require('./controllers/users');

/* RECIPES */
// router.get('/recipes', ctlrsRec.getRecipes);
// router.get('/randoms', ctlrsRec.getRandom);

/* USER CREATION & VALIDATION */
router.post('/userSingup', ctlrsUsr.createUser);
router.post('/userLogin', ctlrsUsr.userLogin);

/* MANAGING FAVOURITES */
router.post('/favourite', ctlrsUsr.addFavourite);
// router.get('/favourites', ctlrsUsr.getFavourites);
router.get('/favouriteIDs', ctlrsUsr.getFavouritesIDs);
router.delete('/favourite', ctlrsUsr.deleteFavourite);

module.exports = router;