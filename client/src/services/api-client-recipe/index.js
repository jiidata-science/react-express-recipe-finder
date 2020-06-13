const apiBaseURL = 'http://localhost:3001';
const apiRecipeURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients';

/* Utility */
function fetchRequest (baseURL, path, options) {
  return fetch(baseURL + path, options)
    .then(res => (res.status <= 400 ? res : Promise.reject(res)))
    .then(res => res.json())
    .catch(err => {
      console.log(err);
      console.log(`Error fetch`);
    });
}

var options = {
  "headers": {
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "x-rapidapi-key": `${ process.env.REACT_APP_APIKEY }`,
    "useQueryString": true
  }
};

/* Get ingredients for autocomplete : REAL */
export function searchIngredients (searchTerm) {
  const num = 15;
  return fetchRequest(apiRecipeURL, `/autocomplete?number=${ num }&query=${ searchTerm }`, options);
}

/* Get recipes for ingredients */
// export function searchMatchingRecipes (ingredients, intolerances) {
//   console.log('ingredients', ingredients);
//   console.log('intolerances', intolerances);
//   return fetchRequest(apiBaseURL, `/recipes?ingredients=${ ingredients }&intolerances=${ intolerances }`);
// }

/* Get selection of random recipes */
export function getRandomRecipeList (searchTags, num) {
  return fetchRequest(apiBaseURL, `/randoms?foodTags=${ searchTags }&num=${ num }`);
}