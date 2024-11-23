import React from 'react';
import '../styles/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faRightToBracket , faHouse} from "@fortawesome/free-solid-svg-icons"

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">DocSearch</div>
      <div className="nav-right">
        {/*<div className='nav-links'> */}
        <FontAwesomeIcon icon={faHouse} />
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
       {/*</div>*/ } 
        <button className="login-button"> <FontAwesomeIcon icon={faRightToBracket} /> Login</button>
      </div> 
      
      
    </nav>
  );
};

export default Navbar;