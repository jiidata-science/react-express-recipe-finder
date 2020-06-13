require('dotenv').config();
const request = require('request-promise');

const API_KEY = process.env.REACT_APP_APIKEY;

/* API CONFIGURATIONS */

const globalOptions = {
  'method': 'GET',
  'headers': {
    'x-rapidapi-key': API_KEY,
    'useQueryString': 'true'
  }
}

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

/* API ENDOINT */

export async function searchMatchingRecipes (ingredients, intolerances) {
  console.log('USING THE NEW API')
  /* RETRIEVE RECOMMENDED RECIPE IDS FROM SERVICE */
  const apiRecipesConfig = await getRecipesFromIngredientsConfig(ingredients.toString(), intolerances.toString())
  let recRecipes = await request(apiRecipesConfig);
  recRecipes = JSON.parse(recRecipes);
  /* RETRIEVE DETAILED RECIPE INFORMATION PER ID */
  let recIDs = recRecipes.results.map(rec => rec.id);
  const apiDetailsConfig = await getRecipeDetailsConfig(recIDs);
  let recDetails = await request(apiDetailsConfig);
  recDetails = JSON.parse(recDetails);
  let recDetailsClean = await processDetails(recDetails);
  /* PREPARE CLEAN RESULTS */
  const resp = await joinRecipeDetails(recRecipes.results, recDetailsClean, recIDs);
  return resp;
}
