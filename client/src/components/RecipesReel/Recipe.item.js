import React, { useEffect, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Delete';

import likeIconClicked from '../../images/like-heart-icon-click.svg';
import likeIconOriginal from '../../images/like-heart-icon.svg';
import weightWatchersImg from '../../images/Weightwatchers-logo.svg.png';
import './styles.css';

function RecipeItem ({
  recipeItem, addToFavourites, favourites, disableLike, loggedIn, deleteItem }) {

  const [ catVegetarian, setVeg ] = useState(false);
  const [ catFodmap, setFodmap ] = useState(false);
  const [ catDairyFree, setDairyFree ] = useState(false);
  const [ catGlutenFree, setGluten ] = useState(false);
  const ingItems = [];
  const distTypes = [];

  function likeItem () {
    addToFavourites({
      id: recipeItem.id,
      title: recipeItem.title
    });
  }

  function isFave () {
    return favourites.some((el) => el.id === recipeItem.id);
  }

  useEffect(() => {
    recipeCategories();
  }, [])

  /* PREPARE INGREDIENTS LIST */
  recipeItem.ingredientsList.forEach((ingr) =>
    ingItems.push(<Chip className='padder' label={ingr} />)
  )

  /* DISH TYPES */
  recipeItem.dishTypes.forEach((type) =>
    distTypes.push(<Chip className='padder' label={type} />)
  )

  function recipeCategories () {
    const types = [];
    for (let item of recipeItem.diets) {
      if (item.includes("gluten") && (!types.includes("gluten"))) {
        types.push("gluten");
        setGluten(true);
      }
      if (item.includes("vegetarian") && (!types.includes("vegetarian"))) {
        types.push("vegetarian");
        setVeg(true);
      }
      if (item.includes("dairy") && (!types.includes("dairy"))) {
        types.push("dairy");
        setDairyFree(true);
      }
      if (item.includes("fodmap") && (!types.includes("fodmap"))) {
        types.push("fodmap");
        setFodmap(true);
      }
    }
    return types;
  }

  return (
    <div className="item">
      <div className="container-recipe-item">
        <a href={recipeItem.sourceUrl} target="_blank" rel="noopener noreferrer">
          <div className="item_image">
            <img className="image_food" alt="recipe-main" src={recipeItem.image} />
            <div className="image_link">
              <p>GO TO RECIPE</p>
            </div>
          </div>
        </a>

        <div className="container-recipe-categories">
          {disableLike === true ?
            <Tooltip title="Delete from faves" TransitionComponent={Zoom} placement="top">
              <DeleteIcon className="delete_icon_position" src={likeIconOriginal} alt="delete_icon" onClick={() => deleteItem(recipeItem.id)} />
            </Tooltip>
            : <img className={isFave() & loggedIn === true ? "image_heart_red" : "image_heart"} src={isFave() ? likeIconClicked : likeIconOriginal} alt="like_logo" onClick={likeItem} />
          }

          {catVegetarian === true ? <Tooltip title="Vegetarian" TransitionComponent={Zoom} placement="top"><span><div class="circle c-green">V</div></span></Tooltip> : <p></p>}
          {catGlutenFree === true ? <Tooltip title="Gluten Free" TransitionComponent={Zoom} placement="top"><span><div class="circle c-red">GF</div></span></Tooltip> : <p></p>}
          {catDairyFree === true ? <Tooltip title="Dairy Free" TransitionComponent={Zoom} placement="top"><span><div class="circle c-yellow">DF</div></span></Tooltip> : <p></p>}
          {catFodmap === true ? <Tooltip title="Fodmap" TransitionComponent={Zoom} placement="top"><span><div class="circle c-blue">F</div></span></Tooltip> : <p></p>}
          {/* {distTypes} */}
        </div>

        <div className="item_title">{recipeItem.title}</div>
        <Divider component="li" />
        <div className="container-recipe-details">
          <h5>Info</h5>

          {disableLike === true ?
            <div className="item_details">
              <p>Ready in <span>{recipeItem.readyInMinutes} minutes</span></p>
              <p>Servings : <span>{recipeItem.servings}</span></p>
            </div>
            :
            <div className="item_details">
              <p>Total ingredients (non-pantry) : <span>{recipeItem.usedIngredientCount + recipeItem.missedIngredientCount}</span></p>
              <p>Num. used ingredients : <span>{recipeItem.usedIngredientCount}</span></p>
              <p>Num. extra ingredients needed : <span>{recipeItem.missedIngredientCount}</span></p>
              <p>Ready in <span>{recipeItem.readyInMinutes} minutes</span></p>
              <p>Servings : <span>{recipeItem.servings}</span></p>
            </div>
          }

          <Divider component="li" />
          <h5>Ingredients</h5>
          <div className="item_ingredients">
            {ingItems}
          </div>

          <Divider component="li" />
          <h5>Healthy eating</h5>
          <div className="item_details_health">
            <img className="item_details_ww_logo" src={weightWatchersImg} />
            <div class="circle c-blue">{recipeItem.weightWatcherSmartPoints}</div>
          </div>

          <Divider component="li" />
          <div className="item_summary">
            <h5>Recipe summary</h5>
            <p><div dangerouslySetInnerHTML={{ __html: recipeItem.summary }} /></p>
          </div>
        </div>
      </div>
    </div >
  );
}

export default RecipeItem;