require('dotenv').config();
const request = require('request-promise');
const API_KEY = process.env.REACT_APP_APIKEY;
const apiBaseURL = 'http://localhost:3001';

const globalOptions = {
  'method': 'GET',
  'headers': {
    'x-rapidapi-key': API_KEY,
    'useQueryString': 'true'
  }
}

/* Utility */
function fetchRequest (baseURL, path, options) {
  return fetch(baseURL + path, options)
    .then(res => (res.status !== 204 ? res : Promise.reject(res)))
    .then(res => res.json())
    .catch(err => {
      console.log(err);
      console.log(`Error fetch`);
    });
}

/* SINGUP */
export function postSignup (bodyObj) {
  console.log('>>> USING THIS NEW ONE')
  return fetchRequest(apiBaseURL, '/userSingup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObj)
  });
}

/* LOGIN */
export function postLogin (bodyObj) {
  console.log('>>> USING THIS NEW ONE')
  return fetchRequest(apiBaseURL, '/userLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObj)
  });
}

/* ADD FAVOURITE */
export function addFavourite (bodyObj) {
  console.log('>>> USING THIS NEW ONE')
  return fetchRequest(apiBaseURL, '/favourite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ sessionStorage.token }`,
      'Cookie': `token=${ sessionStorage.token }`
    },
    body: JSON.stringify(bodyObj)
  });
}

/* DELETE FAVOURITE */
export function deleteFavourite (userEmail, recipe_id) {
  console.log('>>> USING THIS NEW ONE')
  return fetchRequest(apiBaseURL, `/favourite?email=${ userEmail }&recipe_id=${ recipe_id }`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${ sessionStorage.token }`,
      'Cookie': `token=${ sessionStorage.token }`
    }
  });
}

/* GET FAVOURITE IDS */
export function getFavouritesIDs (userEmail) {
  console.log('>>> USING THIS NEW ONE')
  return fetchRequest(apiBaseURL, `/favouriteIDs?email=${ userEmail }`, {
    "headers": {
      "Authorization": `Bearer ${ sessionStorage.token }`,
      "Cookie": `token=${ sessionStorage.token }`
    }
  });
}

function getRecipeDetailsConfig (recipeIDs) {
  console.log('>>> USING THIS NEW ONE')
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
      'ingredientsList': recObj.extendedIngredients.map(ingredient => ingredient.name),
      'summary': recObj.summary,
    });
  }
  return ret;
}

export async function getFavourites (userEmail) {
  console.log('>>> USING THIS NEW ONE')
  const res = await getFavouritesIDs(userEmail);
  const apiDetailsConfig = await getRecipeDetailsConfig(res.recipe_ids);
  let recDetails = await request(apiDetailsConfig);
  recDetails = JSON.parse(recDetails);
  let recDetailsClean = await processDetails(recDetails);
  return recDetailsClean;
}