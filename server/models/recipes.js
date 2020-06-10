require('dotenv').config();
const API_KEY = process.env.RECIPE_API_KEY;

const globalOptions = {
  'method': 'GET',
  'headers': {
    'x-rapidapi-key': API_KEY,
    'useQueryString': 'true'
  }
}

function getRecipesFromIngredientsConfig (ingredients, intolerances) {
  const apiConfig = globalOptions;
  const num = 1;
  apiConfig[ 'url' ] = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?includeIngredients=${ ingredients }&intolerances=${ intolerances }&number=${ num }`;
  return apiConfig;
}

function getRecipeDetailsConfig (recipeIDs) {
  const apiConfig = globalOptions;
  apiConfig[ 'url' ] = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk?ids=${ recipeIDs.join(',') }`;
  console.log(apiConfig.url);
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
      'healthScore:': recObj.healthScore,
      'spoonacularScore': recObj.spoonacularScore,
      'vegetarian': recObj.vegetarian,
      'vegan': recObj.vegan,
      'glutenFree': recObj.glutenFree,
      'dairyFree': recObj.dairyFree,
      'lowFodmap': recObj.lowFodmap,
      'summary': recObj.summary
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

module.exports = { getRecipesFromIngredientsConfig, getRecipeDetailsConfig, processDetails, joinRecipeDetails };