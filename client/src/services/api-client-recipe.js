require('dotenv').config();
const request = require('request-promise');

/* =========== API PARAMS =========== */
const API_KEY = process.env.REACT_APP_APIKEY;
const apiBaseURL = 'http://localhost:3001';
const apiRecipeURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients';

/* =========== API CONFIG =========== */
const globalOptions = {
  'method': 'GET',
  'headers': {
    'x-rapidapi-key': API_KEY,
    'useQueryString': 'true'
  }
}

var options = {
  "headers": {
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "x-rapidapi-key": `${ process.env.REACT_APP_APIKEY }`,
    "useQueryString": true
  }
};

function getRecipesFromIngredientsConfig (ingredients, intolerances) {
  const apiConfig = globalOptions;
  const num = 10;
  apiConfig[ 'url' ] = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?includeIngredients=${ ingredients }&intolerances=${ intolerances }&number=${ num }`;
  return apiConfig;
}

function getRecipeDetailsConfig (recipeIDs) {
  const apiConfig = globalOptions;
  apiConfig[ 'url' ] = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk?ids=${ recipeIDs.join(',') }`;
  return apiConfig;
}

/* =========== UTILITIES =========== */

function fetchRequest (baseURL, path, options) {
  return fetch(baseURL + path, options)
    .then(res => (res.status <= 400 ? res : Promise.reject(res)))
    .then(res => res.json())
    .catch(err => {
      console.log(err);
      console.log(`Error fetch`);
    });
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

function joinRecipeDetails (arr1, arr2, idList) {
  let ret = [];
  for (let id of idList) {
    const arr1c = arr1.filter((el) => el.id === id)[ 0 ];
    const arr2c = arr2.filter((el) => el.id === id)[ 0 ];
    const target = Object.assign(arr1c, arr2c);
    ret.push(target);
  }
  return ret;
}

/* =========== API REQUESTS =========== */

/* GET INGREDIENTS : AUTOCOMPLETE */
export function searchIngredients (searchTerm) {
  const num = 15;
  return fetchRequest(apiRecipeURL, `/autocomplete?number=${ num }&query=${ searchTerm }`, options);
}

/* GET RANDOM RECIPE SUGGESTIONS */
export function getRandomRecipeList (searchTags, num) {
  return fetchRequest(apiBaseURL, `/randoms?foodTags=${ searchTags }&num=${ num }`);
}

/* GET MATCHING RECIPES FOR INGREDIENTS */
export async function searchMatchingRecipes (ingredients, intolerances) {
  console.log('[INFO] Using local recipe api.')
  const apiRecipesConfig = await getRecipesFromIngredientsConfig(ingredients.toString(), intolerances.toString())
  let recRecipes = await request(apiRecipesConfig);
  recRecipes = JSON.parse(recRecipes);
  let recIDs = recRecipes.results.map(rec => rec.id);
  const apiDetailsConfig = await getRecipeDetailsConfig(recIDs);
  let recDetails = await request(apiDetailsConfig);
  recDetails = JSON.parse(recDetails);
  let recDetailsClean = await processDetails(recDetails);
  const resp = await joinRecipeDetails(recRecipes.results, recDetailsClean, recIDs);
  return resp;
}

