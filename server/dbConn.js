const mongoose = require('mongoose');

const DBNAME = 'db_recipes';
const DBOPTIONS = {
  userFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(`mongodb://localhost:27017/${ DBNAME }`, DBOPTIONS);

module.exports = mongoose;