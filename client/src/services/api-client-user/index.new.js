import { getFavouritesIDs } from './index';
import { List } from '@material-ui/core';
require('dotenv').config();
const request = require('request-promise');
const API_KEY = process.env.REACT_APP_APIKEY;

const globalOptions = {
  'method': 'GET',
  'headers': {
    'x-rapidapi-key': API_KEY,
    'useQueryString': 'true'
  }
}

function getRecipeDetailsConfig (recipeIDs) {
  const apiConfig = globalOptions;
  apiConfig[ 'url' ] = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk?ids=${ recipeIDs.join(',') }`;
  return apiConfig;
}

function processDetails (recipesDetails) {
  let ret = [];
  for (let i = 0; i < recipesDetails.length; i++) {
    let recObj = recipesDetails[ i ];
    ret.push({
      'id': recObj.id,
      'title': recObj.title,
      'readyInMinutes': recObj.readyInMinutes,
      'servings': recObj.servings,
      'sourceName': recObj.sourceName,
      'sourceUrl': recObj.sourceUrl,
      'image': recObj.image,
      'spoonacularScore': recObj.spoonacularScore,
      'vegetarian': recObj.vegetarian,
      'vegan': recObj.vegan,
      'glutenFree': recObj.glutenFree,
      'dairyFree': recObj.dairyFree,
      'lowFodmap': recObj.lowFodmap,
      'healthScore:': recObj.healthScore,
      'diets': recObj.diets,
      'dishTypes': recObj.dishTypes,
      'veryPopular': recObj.veryPopular,
      'weightWatcherSmartPoints': recObj.weightWatcherSmartPoints,
      'ingredientsList': recObj.extendedIngredients.map(ingredient => ingredient.name), //[ 'chicken', 'egg', 'tomato', 'apples', 'cinamon', 'peanuts' ],
      'summary': recObj.summary,
    });
  }
  return ret;
}


export async function getFavouritesNEW (userEmail) {
  console.log('CALLING NEW API >>>>>>')
  const res = await getFavouritesIDs(userEmail);
  console.log('faves List', res);
  const apiDetailsConfig = await getRecipeDetailsConfig(res.recipe_ids);
  let recDetails = await request(apiDetailsConfig);
  recDetails = JSON.parse(recDetails);
  let recDetailsClean = await processDetails(recDetails);
  return recDetailsClean;
}