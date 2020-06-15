// const request = require('request-promise');
// const { getRecipesFromIngredientsConfig, getRecipeDetailsConfig, processDetails, joinRecipeDetails } = require('../models/recipes');

// async function getRecipes (req, res) {
//   try {
//     const ingredients = req.query.ingredients;
//     const intolerances = req.query.intolerances;

//     /* RETRIEVE RECOMMENDED RECIPE IDS FROM SERVICE */
//     const apiRecipesConfig = await getRecipesFromIngredientsConfig(ingredients.toString(), intolerances.toString())
//     let recRecipes = await request(apiRecipesConfig);
//     recRecipes = JSON.parse(recRecipes);

//     /* RETRIEVE DETAILED RECIPE INFORMATION PER ID */
//     let recIDs = recRecipes.results.map(rec => rec.id);
//     const apiDetailsConfig = await getRecipeDetailsConfig(recIDs);
//     let recDetails = await request(apiDetailsConfig);
//     recDetails = JSON.parse(recDetails);
//     let recDetailsClean = await processDetails(recDetails);

//     /* PREPARE CLEAN RESULTS */
//     const resp = await joinRecipeDetails(recRecipes.results, recDetailsClean, recIDs);

//     res.status(200);
//     res.json(resp);
//   } catch (err) {
//     console.log('ERROR: ', err); // eslint-disable-line no-console
//     res.sendStatus(500);
//   }
// }

// module.exports = { getRecipes };