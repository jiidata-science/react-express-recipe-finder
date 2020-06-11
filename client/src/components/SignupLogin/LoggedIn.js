import React from 'react';
import './styles.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

function LoggedIn ({ userDetails, funcLogout }) {
  return (
    <div className="logged-in">
      <p>Logged in as <span>{userDetails.firstname} {userDetails.lastname}</span></p>
      <button onClick={funcLogout}>LOGOUT <FontAwesomeIcon icon={faSignOutAlt} size="sm" /></button>
    </div>
  );
}

export default LoggedIn;