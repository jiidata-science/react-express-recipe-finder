import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUtensils, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'

import SearchBar from './components/SearchForm/Search.bar';
import SignupMain from './components/SignupLogin/SingupMain';
import MyFavourites from './components/Favourites/My.favourites';
import Utils from './utils';
import './App.css';

/* CREATE LIBRARY OF ICONS FOR USE */
library.add(faSearch,
  faUtensils,
  faSignInAlt,
  faUserPlus);

function App () {

  // RECIPES states
  const [ chosenIngredients, setChosen ] = useState([]);
  const [ chosenClean, setChosenClean ] = useState([]);
  const [ foundRecipes, setRecipes ] = useState([]);
  const [ favourites, setFavourites ] = useState([]);

  // USER LOGIN states
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ userDetails, setUserDetails ] = useState(null);

  // ONLOAD HOMEPAGE state
  const [ showInitialPopup, setInitPopup ] = useState(true);

  useEffect(() => {
    const user = Utils.getUser();
    if (user !== null) {
      setLoggedIn(true);
      setUserDetails(user);
    };
  }, [])

  return (
    <div className="app">
      <Router>

        {/* MAIN NAVIGATION */}
        <div className="header">
          <div className="main_banner">
            <div className="main_banner_logo">
              <Link to="/" className="logo_font">R</Link>
            </div>
            <Link className="main_nav_link nav_btn_hover_text" to="/" data-text="Search"><span><FontAwesomeIcon icon={faSearch} size="2x" /></span></Link>
            <Link className="main_nav_link nav_btn_hover_text" to="/favourites" data-text="My Recipes"><span><FontAwesomeIcon icon={faUtensils} size="2x" /></span></Link>
            <div></div>
            <Link className="main_banner_singup nav_btn_hover_text" to="/signup" data-text="Log or Sign In"><span><FontAwesomeIcon icon={faUserPlus} size="2x" /></span></Link>
          </div>
        </div>




        <Switch>
          <Route exact path="/">
            <SearchBar
              chosenIngredients={chosenIngredients}
              setChosen={setChosen}
              chosenClean={chosenClean}
              setChosenClean={setChosenClean}
              foundRecipes={foundRecipes}
              setRecipes={setRecipes}
              favourites={favourites}
              setFavourites={setFavourites}

              /* Initial popup on page */
              showInitialPopup={showInitialPopup}
              setInitPopup={setInitPopup}

              /* change functionality based on state */
              loggedIn={loggedIn}
            />
          </Route>
          <Route path="/favourites">
            {(loggedIn === false ? <Redirect to='/signup' /> :
              <MyFavourites
                loggedIn={loggedIn}
                favourites={favourites} />)}
          </Route>
          <Route path="/signup">
            <SignupMain
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              userDetails={userDetails}
              setUserDetails={setUserDetails}
            />
          </Route>
        </Switch>


      </Router>
    </div >
  )
}


export default App;