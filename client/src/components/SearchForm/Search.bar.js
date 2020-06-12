import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';

import './styles.css';
import _ from 'lodash';

import { searchIngredients, searchMatchingRecipes } from '../../services/api-client-recipe';
import { addFavourite, deleteFavourite } from '../../services/api-client-user';

import SearchItem from './Search.results';
import searchIcon from '../../images/search-icon.svg';
import ChosenItem from './Chosen.item';
import RecipeList from '../RecipesReel/Recipe.list';
import Spinner from '../Spinner';

import Utils from '../../utils';
const popup_image = '../../images/popup_instructional_img.jpg';

function SearchBar ({ chosenIngredients, setChosen, chosenClean, setChosenClean, foundRecipes, setRecipes, favourites, setFavourites, loggedIn, showInitialPopup, setInitPopup }) {

  const [ ingredients, setItems ] = useState([]);
  const [ searchTerm, setTerm ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const debounceOnChange = React.useCallback(_.debounce(getIngredients, 450), []);

  useEffect(() => {

    if (showInitialPopup === true && !loggedIn) {
      Swal.fire(
        {
          title: "Find recipes for your ingredients",
          text: `Looking for recipes that use specific ingredients? Tired of wasting food that you forgot to use? Get some recipe ideas for ingredients you have at home with our recipe search.`,
          imageUrl: 'https://media.treehugger.com/assets/images/2020/04/getting_ingredients_out_of_the_fridge.jpg.600x315_q90_crop-smart.jpg',
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: 'Popup_image',
          confirmButtonText: "START NOW",
          confirmButtonColor: '#505050',
        }
      );
      setInitPopup(false);
    }
  }, [])

  function getIngredients (searchTerm) {
    if (searchTerm.length > 0) {
      searchIngredients(searchTerm)
        .then(res => res.map(item => item))
        .then(item => setItems(item))
        .then(() => console.log('fired'))
    } else { setItems([]); }
  }

  function handleSearchTerm (term) {
    setTerm(term);
  }

  function handleSubmit (event) {
    event.preventDefault();
    if (searchTerm.length > 3) {
      setChosen([ ...chosenIngredients, searchTerm ]);
      const shortTerm = (searchTerm.length > 10) ? searchTerm.slice(0, 9) + '...' : searchTerm;
      setChosenClean([ ...chosenClean, shortTerm ]);
      setTerm(''); setItems([]);
      return;
    }
    Swal.fire(
      {
        title: "Search and find ingredient.",
        text: "Please select an ingredient before adding.",
        icon: "info",
        showCloseButton: true,
        confirmButtonColor: '#505050',
        confirmButtonText: 'CLOSE',
      });
  }

  function handleDeleteItem (item) {
    const removedList = chosenIngredients.filter(itm => item !== itm);
    setChosen([ ...removedList ]);

    const removedCleanList = chosenClean.filter((itm, key) => key !== chosenIngredients.indexOf(item));
    setChosenClean([ ...removedCleanList ]);

  }

  function getRecipesFromIngredients (ingredients, intolerances) {
    setLoading(true);
    searchMatchingRecipes(ingredients, intolerances)
      .then(res => setRecipes(res))
      .then(() => setLoading(false));
  }

  function clearForm () {
    setChosen([]);
    setChosenClean([]);
  }

  /* ADD REMOVE FAVOURITES */
  function addRemoveFavourite (item) {
    if (loggedIn !== true) {
      return Swal.fire(
        {
          title: "Please signup and/or login",
          text: "Signup and/or login to save recipes to your favourites.",
          type: "info",
          icon: "info",
          showCloseButton: true,
          confirmButtonColor: '#505050',
          confirmButtonText: 'CLOSE',
        });
    }

    let remove_or_add = 'add';
    favourites.forEach((el) => {
      if (el.id === item.id) {
        remove_or_add = 'remove';
      }
    });

    if (remove_or_add === 'add') {
      const postMsg = { 'email': Utils.getUser().email, 'recipe_id': item.id }
      addFavourite(postMsg)
        .then(() => {
          setFavourites((favourites) => {
            return [ ...favourites, item ]
          })
        })
    }

    if (remove_or_add !== 'add') {
      deleteFavourite(Utils.getUser().email, item.id)
        .then(() => {
          setFavourites((favourites) => {
            let tempFaves = favourites.filter((el) => el.id !== item.id)
            return [ ...tempFaves ];
          })
        })

    }
  }

  return (
    <div className="search" onSubmit={handleSubmit}>
      <h1 className="chosen_items_title">Recipe Search</h1>
      <div className="search_intro_text">
        <p><span className="paragraph-bold">Search for and add each ingredient</span> to your list before clicking <span className="paragraph-bold">search recipes</span>.</p>
      </div>

      <form className="search_form">
        <span className="search_icon" role="img" aria-label="search">
          <img src={searchIcon} alt="search_logo" />
        </span>

        <input className="search_bar"
          type="text"
          placeholder="Start typing your ingredient..."
          value={searchTerm}
          onChange={(e) => {
            const term = e.target.value;
            handleSearchTerm(term);
            debounceOnChange(term);
          }}>
        </input>
        <button className="search_button" type="submit">+</button>
      </form>

      {/* list ingredients to choose  */}
      <ul className="search_results">
        {ingredients.map((item) =>
          <SearchItem
            key={item.name}
            ingredient={item.name}
            setTerm={setTerm} />
        )}
      </ul>

      {/* chosen ingredients*/}
      <div className="chosen_items_list">
        <ul >
          {chosenIngredients.map((item, key) =>
            <ChosenItem item={item} itemClean={chosenClean[ key ]} funcDelete={handleDeleteItem} />)
          }
        </ul>
      </div>

      {/* search for recipes*/}

      <div className="request_recipes">
        <div >
          <button className="request_submit"
            onClick={() => getRecipesFromIngredients(chosenIngredients, 'peanuts')}>Search recipes</button>
        </div>
        <div >
          <button className="request_clear" onClick={clearForm}>clear all</button>
        </div>
      </div>


      {/* show recipes results */}
      <ul className="">
        {(loading) ? <Spinner /> : (foundRecipes.length > 0) ?
          <RecipeList
            recipeList={foundRecipes}
            addToFavourites={addRemoveFavourite}
            favourites={favourites}
            disableLike={false}
            loggedIn={loggedIn}
          />
          : <h2 className="chosen_items_title">No recipes yet</h2>}
      </ul>
    </div >
  );
}

export default SearchBar;