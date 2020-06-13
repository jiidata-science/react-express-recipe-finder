import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import AlertConfig from '../../utils/alertConfig';
import './styles.css';

const initFormState = {
  email: '',
  firstname: '',
  lastname: '',
  password: ''
};

function SignUp ({ postSignup, signupSuccess, errorMessage, setErrorMessage }) {

  setErrorMessage('');
  const [ user, setUser ] = useState(initFormState);
  const [ show, setShow ] = useState(false);
  const [ showTxt, setShowTxt ] = useState('SHOW');

  function handleChange ({ target }) {
    setUser(user => ({ ...user, [ target.name ]: target.value }));
  }

  function handleSubmit (event) {
    event.preventDefault();
    if (emailValidation()) {
      postSignup(user);
      setUser(initFormState);
    } else {
      Swal.fire(AlertConfig.warnings.notEmailFormat);
    }
  }

  function showHide () {
    show ? setShow(false) : setShow(true);
    show ? setShowTxt('SHOW') : setShowTxt('HIDE');
  }

  function emailValidation () {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) { return true; } /* eslint no-useless-escape: "off" */
    return false;
  }

  return (
    <div className="form-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign-up</h2>
        <input type="text" name="email" className="forminput_email box-styling" required placeholder="Email address" value={user.email} onChange={handleChange} />
        <input type="text" name="firstname" className="forminput_firstname box-styling" required placeholder="Firstname" value={user.firstname} onChange={handleChange} />
        <input type="text" name="lastname" className="forminput_lastname box-styling" required placeholder="Lastname" value={user.lastname} onChange={handleChange} />
        <div className="password_inline">
          <input type={show ? 'text' : 'password'} name="password" className="forminput_password box-styling form-control" required placeholder="Password" value={user.password} onChange={handleChange} />
          <div className="password_show" onClick={showHide}>{showTxt}</div>
        </div>
        <button className="form_submit submit-styling" type="submit">SIGN UP  <FontAwesomeIcon icon={faUserPlus} size="sm" /></button>
      </form>
    </div>
  );
}

export default SignUp;