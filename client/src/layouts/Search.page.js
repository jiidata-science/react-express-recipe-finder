import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { addFavourite, deleteFavourite } from '../services/api-client-user.js';
import { searchIngredients, searchMatchingRecipes } from '../services/api-client-recipe.js';

import SearchItem from '../components/SearchForm/Search.results';
import ChosenItem from '../components/SearchForm/Chosen.item';
import RecipeList from '../components/RecipesReel/Recipe.list';
import Spinner from '../components/Spinner';

import Utils from '../utils';
import AlertConfig from '../utils/alertConfig';

import '../components/SearchForm/styles.css';

/* CREATE LIBRARY OF ICONS FOR USE */
library.add(faSearch);

function SearchBar ({ chosenIngredients, setChosen, chosenClean, setChosenClean,
  foundRecipes, setRecipes, favourites, setFavourites,
  loggedIn, showInitialPopup, setInitPopup }) {

  const [ ingredients, setItems ] = useState([]);
  const [ searchTerm, setTerm ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const debounceOnChange = React.useCallback(_.debounce(getIngredients, 300), []);

  /* ONLOAD : CHECK LOGIN AND SHOW INSTRUCTIONAL POPUP */
  useEffect(() => {
    if (showInitialPopup === true && !loggedIn) {
      Swal.fire(AlertConfig.instructionalAlert);
      setInitPopup(false);
    }
  }) // removed []

  /* FUNC : SETTING SEARCH TERM STATE */
  function handleSearchTerm (term) {
    setTerm(term);
  }

  /* FUNC : ADD FOUND INGREDIENT TO CHOSEN LIST STATE */
  function handleSubmit (event) {
    event.preventDefault();
    if (searchTerm.length > 3) {
      setChosen([ ...chosenIngredients, searchTerm ]);
      const shortTerm = (searchTerm.length > 10) ? searchTerm.slice(0, 9) + '...' : searchTerm;
      setChosenClean([ ...chosenClean, shortTerm ]);
      setTerm(''); setItems([]);
      return;
    }
    Swal.fire(AlertConfig.warnings.addIngredient);
  }

  /* FUNC : DELETE ITEM FROM CHOSEN LIST STATE */
  function handleDeleteItem (item) {
    const removedList = chosenIngredients.filter(itm => item !== itm);
    setChosen([ ...removedList ]);
    const removedCleanList = chosenClean.filter((itm, key) => key !== chosenIngredients.indexOf(item));
    setChosenClean([ ...removedCleanList ]);
  }

  /* FUNC : CLEAR FORM */
  function clearForm () {
    setChosen([]);
    setChosenClean([]);
  }

  /* SUCCESS MESSAGE FOR SAVING TO FAVES */
  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  /* ------------ APIS --------------- */

  /* AUTOCOMPLETE API : INGREDIENTS FROM SEARCH TERM */
  function getIngredients (searchTerm) {
    if (searchTerm.length > 0) {
      searchIngredients(searchTerm)
        .then(res => res.map(item => item))
        .then(item => setItems(item))
        .then(() => console.log('fired'))
    } else { setItems([]); }
  }

  /* AUTOCOMPLETE API : GET RECIPE RECOMMENDATIONS FROM INGREDIENTS */
  function getRecipesFromIngredients (ingredients, intolerances) {
    setLoading(true);
    searchMatchingRecipes(ingredients, intolerances)
      .then(res => setRecipes(res))
      .then(() => setLoading(false));
  }

  /* ADD REMOVE FAVOURITES */
  function addRemoveFavourite (item) {
    if (loggedIn !== true) {
      return Swal.fire(AlertConfig.warnings.loginPrompt);
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
        .then(() => Toast.fire({ icon: 'success', title: 'Added another recipe.' }));
    }
    if (remove_or_add !== 'add') {
      deleteFavourite(Utils.getUser().email, item.id)
        .then(() => {
          setFavourites((favourites) => {
            let tempFaves = favourites.filter((el) => el.id !== item.id)
            return [ ...tempFaves ];
          })
        })
        .then(() => Toast.fire({ icon: 'success', title: 'Recipe removed from faves.' }));
    }
  }

  return (
    <div className="search" onSubmit={handleSubmit}>

      {/* TITLE AND PARAGRAPH */}
      <h1 className="chosen_items_title">Recipe Search</h1>
      <div className="search_intro_text">
        <p>
          <span className="paragraph-bold">
            Search for and add each ingredient
          </span> to your list before clicking
          <span className="paragraph-bold"> search recipes
            </span>.</p>
      </div>

      {/* MAIN SEARCH BAR */}
      <form className="search_form">
        <span className="search_icon" role="img" aria-label="search">
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </span>
        <input
          className="search_bar"
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

      {/* SEARCH BAR - AUTOCOMPLETE DROPDOWN LIST */}
      <ul className="search_results">
        {ingredients.map((item) =>
          <SearchItem
            key={item.name}
            ingredient={item.name}
            setTerm={setTerm} />
        )}
      </ul>

      {/* CHOSEN INGREDIENTS LIST */}
      <div className="chosen_items_list">
        <ul >{chosenIngredients.map((item, key) =>
          <ChosenItem item={item}
            itemClean={chosenClean[ key ]}
            funcDelete={handleDeleteItem} />)
        }</ul>
      </div>

      {/* RECIPE SEARCH ACTIONS */}
      <div className="request_recipes">
        <div >
          <button className="request_submit"
            onClick={() => getRecipesFromIngredients(chosenIngredients, 'peanuts')}>search recipes</button>
        </div>
        <div >
          <button className="request_clear" onClick={clearForm}>clear all</button>
        </div>
      </div>

      {/* RECIPE SEARCH RESULTS */}
      <ul>
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