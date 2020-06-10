'use strict';

const request = require('request-promise');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const { UserCredentials, UserRecipes } = require('../models/users');
const { processResponse, optionsRecipes } = require('../models/recipes');
const { getRecipeDetailsConfig, processDetails } = require('../models/recipes');

/* -------------------------------------------------- */
/* AUTHENTICATION MIDDLEWARE */
/* -------------------------------------------------- */

function mwAuthenticate () {
  const secret = process.env.JWT_SECRET;
  return expressJwt({ secret }).unless({
    path: [
      '/recipes', '/userSingup', '/userLogin'
    ]
  });
}

/* -------------------------------------------------- */
/* LOGIN UTILS */
/* -------------------------------------------------- */

const utils = {
  generateToken: function (user) {
    if (!user) return null;
    const u = {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname
    };
    return jwt.sign(u, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 // expires in 1 hour
    });
  },
  getCleanUser: function (user) {
    if (!user) return null;
    return {
      email: user.emailHash, //user.email,
      firstname: user.firstname,
      lastname: user.lastname
    };
  },
  getCleanUserEmail: function (hashedEmail, lclEmail) {
    return UserCredentials.emailReverseHash(hashedEmail, lclEmail)
  }
}

/* -------------------------------------------------- */
/* CREATE USER */
/* -------------------------------------------------- */

async function createUser (req, res) {
  try {
    const bdy = req.body;
    /* CHECK INCOMING VARIABLES */
    if (!bdy.email || !bdy.firstname || !bdy.lastname || !bdy.password) {
      res.status(422);
      res.json({ 'status': [ 'Bad Request', 'email address, firstname, lastname and/or password' ] });
    }
    /* CHECK IF USER EXISTS ALREADY */
    const emailCheck = await UserCredentials.find({ email: bdy.email });
    if (emailCheck.length > 0) {
      res.status(409);
      res.json({ 'status': [ 'Bad Request', 'email address already exists. Please login instead.' ] });
    }
    /* OTHERWISE: CREATE USER */
    const user = await UserCredentials.create({
      email: bdy.email,
      emailHash: UserCredentials.emailHash(bdy.email),
      firstname: bdy.firstname,
      lastname: bdy.lastname,
      password: UserCredentials.generateHash(bdy.password)
    });
    res.status(201);
    res.json(utils.getCleanUser(user));
  } catch (err) {
    console.log('ERROR: ', err); // eslint-disable-line no-console
    res.sendStatus(500);
  }
}

/* -------------------------------------------------- */
/* LOGIN */
/* -------------------------------------------------- */

async function userLogin (req, res) {
  try {

    const bdy = req.body;

    /* CHECK BASIC AUTH */
    const authbs64 = (req.headers.authorization || '').split(' ')[ 1 ] || '';
    const authString = Buffer.from(b64auth, 'base64').toString();
    const splitIndex = strauth.indexOf(':');
    const [ email, pw ] = [ strauth.substring(0, splitIndex), strauth.substring(1, splitIndex) ];
    if (!email || pw) {
      res.status(422);
      res.json({ 'status': [ 'Bad Request', 'email or password missing.' ] });
    }

    /* CHECK INCOMING VARIABLES */
    if (!bdy.email || !bdy.password) {
      res.status(422);
      res.json({ 'status': [ 'Bad Request', 'email or password missing.' ] });
    }
    /* CHECK : IF EMAIL EXIST THEN FAIL */
    const emailCheck = await UserCredentials.find({ email: bdy.email });
    if (emailCheck.length === 0) {
      res.status(400);
      res.json({ 'status': [ 'Bad Request', 'email address is not recognised.' ] });
    }
    /* CHECK : USERNAME AND PASSWORD MATCH EXPECTED */
    const userDetails = emailCheck[ 0 ];
    const pwMatch = (UserCredentials.validPassword(bdy.password, userDetails.password)) ? true : false;
    if (!pwMatch) {
      res.status(401);
      res.json({ 'status': [ 'Bad Request', 'email and password do not match.' ] });
    }
    /* OTHERWISE : GENERATE TOKEN FOR STATE MANAGEMENT */
    const token = utils.generateToken(userDetails);
    const userObj = utils.getCleanUser(userDetails);
    res.status(200);
    res.cookie('token', token, { httpOnly: true })
    res.json({ user: userObj, token });

  } catch (err) {
    console.log('ERROR: ', err); // eslint-disable-line no-console
    res.sendStatus(500);
  }
}

/* -------------------------------------------------- */
/* USER ACTION : ADD TO FAVOURITES */
/* -------------------------------------------------- */


async function addFavourite (req, res) {
  try {
    const bdy = req.body;
    const emailClean = await UserCredentials.find({ emailHash: bdy.email });
    const recipe = await UserRecipes.create({ email: emailClean[ 0 ].email, recipe_id: bdy.recipe_id });
    recipe[ 'email' ] = bdy.email;
    res.status(201);
    res.json(recipe);
  } catch (err) {
    console.log('ERROR: ', err); // eslint-disable-line no-console
    res.sendStatus(500);
  }
}

async function getFavourites (req, res) {
  try {
    const emailAdd = req.query.email;
    const emailClean = await UserCredentials.find({ emailHash: emailAdd });
    const favourites = await UserRecipes.find({ email: emailClean[ 0 ].email });
    /* REMOVE DUPLICATES */
    let recIDs = [];
    favourites.forEach(el => {
      if (!recIDs.includes(el.recipe_id)) {
        recIDs.push(el.recipe_id)
      }
    });
    if (recIDs.length === 0) {
      res.status(202);
      res.json({ 'status': [ 'No favourites' ] });
    } else {
      /* RETRIEVE DETAILED RECIPE INFORMATION PER ID */
      const apiDetailsConfig = await getRecipeDetailsConfig(recIDs);
      let recDetails = await request(apiDetailsConfig);
      recDetails = JSON.parse(recDetails);
      let recDetailsClean = await processDetails(recDetails);
      res.status(200);
      res.json(recDetailsClean);
    }
  } catch (err) {
    console.log('ERROR: ', err); // eslint-disable-line no-console
    res.sendStatus(500);
  }
}

async function deleteFavourite (req, res) {
  try {
    const emailAdd = req.query.email;
    const emailClean = await UserCredentials.find({ emailHash: emailAdd });
    const recipeID = req.query.recipe_id;
    const deleted = await UserRecipes.deleteMany({ email: emailClean[ 0 ].email, recipe_id: recipeID });
    res.status(204);
    res.json({ 'status': [ 'OK', 'item reference deleted.' ] });
  } catch (err) {
    console.log('ERROR: ', err); // eslint-disable-line no-console
    res.sendStatus(500);
  }
}

module.exports = {
  createUser, userLogin, addFavourite, getFavourites, deleteFavourite, mwAuthenticate
};