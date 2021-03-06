import React, { useState, useEffect } from 'react';
import SignUp from '../components/SignupLogin/Signup';
import Login from '../components/SignupLogin/Login';
import LoggedIn from '../components/SignupLogin/Logged.in';

import { postSignup, postLogin } from '../services/api-client-user.js';
import Utils from '../utils';
import Swal from 'sweetalert2';
import '../components/SignupLogin/styles.css';

function SignupMain ({ setLoggedIn, loggedIn, userDetails, setUserDetails, loginRedirect, setLoginRedirect }) {

  const [ page, setPage ] = useState('signup');
  const [ errorMessage, setErrorMessage ] = useState('');

  const SignupErrorPopup = Swal.mixin({
    title: 'There was a problem!',
    text: 'Error',
    icon: 'warning'
  });

  const RedirectError = Swal.mixin({
    title: 'Login to create favourites.',
    icon: 'info'
  });

  useEffect(() => {
    if (Utils.getToken() !== null) {
      setLoggedIn(true);
    }
    /* IF NOT LOGGED IN SHOW MESSAGE */
    if (loginRedirect) {
      RedirectError.fire({ text: 'Login first to start saving recipes.' });
      setLoginRedirect(false);
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
    position: 'top',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })



  function login (obj) {
    setErrorMessage('');
    postLogin(obj)
      .then(res => {
        if ((res) && (res.token)) {
          Utils.setUserSession(res.token, res.user);
          setUserDetails(res.user);
          setLoggedIn(true);
          /* LOGIN USER ALERT */
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
          // setSignupFlag(true);

          /* USER ALERT SIGNUP */
          Toast.fire({
            icon: 'success',
            title: 'Signed up! Please login.'
          })
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

    /* USER ALERT LOGOUT */
    Toast.fire({
      icon: 'success',
      title: 'Signed out successfully'
    })
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