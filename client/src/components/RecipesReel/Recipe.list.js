import React from 'react';
import './styles.css';
import RecipeItem from './Recipe.item';

function RecipeList ({ recipeList, addToFavourites, favourites, disableLike, loggedIn, deleteItem }) {

  console.log(recipeList);
  return (
    <div className="recipe_list_container">
      {
        recipeList.map((recipe =>
          <RecipeItem
            key={recipe.id + Math.floor(1000 * Math.random())}
            recipeItem={recipe}
            addToFavourites={addToFavourites}
            favourites={favourites}
            disableLike={disableLike}
            loggedIn={loggedIn}
            deleteItem={deleteItem}
          />))
      }
    </div>
  );
}

export default RecipeList;