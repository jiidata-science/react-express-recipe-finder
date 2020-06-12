import React, { useState, useEffect } from 'react';
import './styles.css';
import SignUp from './Singup';
import Login from './Login';
import LoggedIn from './LoggedIn';

import { postSignup, postLogin } from '../../services/api-client-user';
import Utils from '../../utils';

import Swal from 'sweetalert2';


function SignupMain ({ setLoggedIn, loggedIn, userDetails, setUserDetails }) {

  const [ page, setPage ] = useState('signup');
  const [ signUpFlag, setSignupFlag ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    if (Utils.getToken() !== null) {
      setLoggedIn(true);
    }
  }, [])

  function changePage (toPage) {
    if (toPage === 'signup') {
      setPage('signup');
    } else {
      setPage('login')
    }
  }

  /* LOGIN SUCCESSFUL POPUP */
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const SignupErrorPopup = Swal.mixin({
    title: 'There was a problem!',
    text: 'Error',
    icon: 'warning'
  });

  function login (obj) {
    setErrorMessage('');
    postLogin(obj)
      .then(res => {
        if ((res) && (res.token)) {
          Utils.setUserSession(res.token, res.user);
          setUserDetails(res.user);
          setLoggedIn(true);

          Toast.fire({
            icon: 'success',
            title: 'Signed in successfully'
          })
        } else {
          setErrorMessage(res.status[ 1 ]);
          SignupErrorPopup.fire({ text: res.status[ 1 ] });
        }
      })
  }

  function signup (obj) {
    setErrorMessage('');
    postSignup(obj)
      .then(res => {
        console.log(res);
        if ((res) && (res.email)) {
          setPage('login');
          setSignupFlag(true);
        } else {
          setErrorMessage(res.status[ 1 ]);
          SignupErrorPopup.fire({ text: res.status[ 1 ] });
        }
      })
  }

  function logout () {
    Utils.removeUserSession();
    setLoggedIn(false);
    setUserDetails(null);
  }

  return (
    <div className="signin-main">
      {(
        loggedIn === true ? <div className="signin_chooser"></div> :
          <div className="signin_chooser">
            <span className={page === 'signup' ? "selected_page" : "unselected_page"} role="button" onClick={() => changePage('signup')}>Signup</span>
            <span className={page !== 'signup' ? "selected_page" : "unselected_page"} role="button" onClick={() => changePage('login')}>Login</span>
          </div>
      )}
      {(
        loggedIn === true ? <LoggedIn userDetails={userDetails} funcLogout={logout} /> : (page === 'signup') ?
          <SignUp postSignup={signup} signupSuccess={loggedIn} errorMessage={errorMessage} setErrorMessage={setErrorMessage} /> :
          <Login postLogin={login} errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
      )}
    </div>
  );
}

export default SignupMain;