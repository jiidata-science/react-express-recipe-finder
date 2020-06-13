const apiBaseURL = 'http://localhost:3001';

/* Utility */
function fetchRequest (baseURL, path, options) {
  return fetch(baseURL + path, options)
    .then(res => (res.status !== 204 ? res : Promise.reject(res)))
    .then(res => res.json())
    .catch(err => {
      console.log(err);
      console.log(`Error fetch`);
    });
}

/* SINGUP */
export function postSignup (bodyObj) {
  return fetchRequest(apiBaseURL, '/userSingup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObj)
  });
}

/* LOGIN */
export function postLogin (bodyObj) {
  return fetchRequest(apiBaseURL, '/userLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObj)
  });
}

/* ADD FAVOURITE */
export function addFavourite (bodyObj) {
  return fetchRequest(apiBaseURL, '/favourite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ sessionStorage.token }`,
      'Cookie': `token=${ sessionStorage.token }`
    },
    body: JSON.stringify(bodyObj)
  });
}

/* DELETE FAVOURITE */
export function deleteFavourite (userEmail, recipe_id) {
  return fetchRequest(apiBaseURL, `/favourite?email=${ userEmail }&recipe_id=${ recipe_id }`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${ sessionStorage.token }`,
      'Cookie': `token=${ sessionStorage.token }`
    }
  });
}

/* GET FAVOURITES */
export function getFavourites (userEmail) {
  return fetchRequest(apiBaseURL, `/favourites?email=${ userEmail }`, {
    "headers": {
      "Authorization": `Bearer ${ sessionStorage.token }`,
      "Cookie": `token=${ sessionStorage.token }`
    }
  });
}

/* GET FAVOURITE IDS */
export function getFavouritesIDs (userEmail) {
  return fetchRequest(apiBaseURL, `/favouriteIDs?email=${ userEmail }`, {
    "headers": {
      "Authorization": `Bearer ${ sessionStorage.token }`,
      "Cookie": `token=${ sessionStorage.token }`
    }
  });
}