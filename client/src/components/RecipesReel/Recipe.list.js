import React from 'react';
import './styles.css';
import RecipeItem from './Recipe.item';

function RecipeList ({ recipeList, addToFavourites, favourites, disableLike, loggedIn }) {

  return (
    <div className="recipe-list">
      {
        recipeList.map((recipe =>
          <RecipeItem
            key={recipe.id + Math.floor(1000 * Math.random())}
            recipeItem={recipe}
            addToFavourites={addToFavourites}
            favourites={favourites}
            disableLike={disableLike}
            loggedIn={loggedIn}
          />))
      }
    </div>
  );
}

export default RecipeList;