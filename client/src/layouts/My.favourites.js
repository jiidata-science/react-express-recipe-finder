import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Utils from '../utils';
import { deleteFavourite, getFavourites } from '../services/api-client-user.js';
import RecipeList from '../components/RecipesReel/Recipe.list';
import Spinner from '../components/Spinner';
import '../components/Favourites/styles.css';

function MyFavourites ({ loggedIn, favourites }) {

  const [ myFaves, setMyFaves ] = useState([]);
  const [ userName, setUserName ] = useState('');

  useEffect(() => {
    const user = Utils.getUser();
    if (user !== null) {
      getFavourites(user.email)
        .then(res => { setMyFaves(res) })
        .catch(() => setMyFaves([]))
    }

    const userName = JSON.parse(sessionStorage.user).firstname;
    if (userName !== undefined) {
      setUserName(userName);
    }
  }, []);

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

  /* DELETE ITEM FROM FAVOURITES */
  function deleteItem (id) {
    deleteFavourite(Utils.getUser().email, id)
      .then(() => {
        setMyFaves((myFaves) => {
          let tempFaves = myFaves.filter((el) => el.id !== id)
          return [ ...tempFaves ];
        })
      })
      .then(() => Toast.fire({ icon: 'success', title: 'Recipe removed from faves.' }));
    return;
  }

  return (
    <div className="my_favourites">
      {
        myFaves.length > 0 ?
          <div>
            <h1>Your favourite recipes, <span className="fave_name">{userName}</span></h1>
            <ul>
              {myFaves.length > 0 ?
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




