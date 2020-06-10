'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./router');
const cookieParser = require('cookie-parser');
const { mwAuthenticate } = require('./controllers/users');

const PORT = 3001;
const app = express();

app.use(cors());
app.use(morgan('tiny')); // console logger middleware
app.use(cookieParser()); // retrieve cookie from header (client must call with bearer token from cookie)
app.use(express.json()); // similar to body-parser
app.use(mwAuthenticate()); // middleware to check authenticated routes

app.use(routes);

app.listen(PORT, () => {
  console.log(`Express server now running on http://localhost:${ PORT } 🚀`); // eslint-disable-line no-console
});