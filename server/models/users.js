const mongoose = require('../dbConn');
const bcrypt = require('bcrypt');

const UserCredentialsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  emailHash: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true }
});

UserCredentialsSchema.statics.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
UserCredentialsSchema.statics.validPassword = function (reqPassword, lclPassword) {
  return bcrypt.compareSync(reqPassword, lclPassword);
}

UserCredentialsSchema.statics.emailHash = function (emailRaw) {
  return bcrypt.hashSync(emailRaw, bcrypt.genSaltSync(10))
}
UserCredentialsSchema.statics.emailReverseHash = function (reqEmail, lclEmail) {
  return bcrypt.compareSync(reqEmail, lclEmail);
}

const UserRecipesSchema = new mongoose.Schema({
  email: { type: String, required: true },
  recipe_id: { type: String, required: true }
});

const UserRecipes = mongoose.model('UserRecipes', UserRecipesSchema);
const UserCredentials = mongoose.model('UserCredentials', UserCredentialsSchema);

module.exports = { UserCredentials, UserRecipes };