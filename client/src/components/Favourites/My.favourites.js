import React, { useEffect, useState } from 'react';
import { getFavourites, deleteFavourite } from '../../services/api-client-user';
import Utils from '../../utils';
import RecipeList from '../RecipesReel/Recipe.list';
import Spinner from '../Spinner';
import './styles.css';



function MyFavourites ({ loggedIn, favourites }) {

  const [ myFaves, setMyFaves ] = useState([ 'init' ]);
  const [ userName, setUserName ] = useState('');

  useEffect(() => {
    const user = Utils.getUser();
    console.log(user)
    if (user !== null) {
      getFavourites(user.email)
        .then(res => { setMyFaves(res) })
        .catch(() => {
          setMyFaves([]);
        })
    }

    const userName = JSON.parse(sessionStorage.user).firstname;
    if (userName !== undefined) {
      setUserName(userName);
    }
  }, []);

  /* DELETE ITEM FROM FAVOURITES */
  function deleteItem (id) {
    deleteFavourite(Utils.getUser().email, id)
      .then(() => {
        setMyFaves((myFaves) => {
          let tempFaves = myFaves.filter((el) => el.id !== id)
          return [ ...tempFaves ];
        })
      })
    return;
  }

  return (
    <div className="my_favourites">
      {
        myFaves.length > 0 ?
          <div>
            <h1>Your favourite recipes, <span className="fave_name">{userName}</span></h1>
            <ul>
              {myFaves.length > 1 ?
                <RecipeList
                  recipeList={myFaves}
                  favourites={favourites}
                  disableLike={true}
                  loggedIn={loggedIn}
                  deleteItem={deleteItem} />
                : <Spinner />
              }
            </ul>
          </div>
          :
          <div>
            <h1>You have no saved recipes yet, <span className="fave_name">{userName}</span></h1>
          </div>
      }

    </div>
  );
}

export default MyFavourites;




