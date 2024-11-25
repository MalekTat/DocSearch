import React from 'react';
import {Link } from 'react-router-dom'
import '../styles/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faRightToBracket , faHouse} from "@fortawesome/free-solid-svg-icons"

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to = {'/'} className="logo"> DocSearch </Link>
      <div className="nav-right">
        
        <Link to = {'/'} >
        <FontAwesomeIcon icon={faHouse} />
        </Link>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
        <Link to ={'/login'} className='button-container' >
        <button className="login-button"> <FontAwesomeIcon icon={faRightToBracket} /> Login</button>
        </Link>
      </div> 
      
      
    </nav>
  );
};

export default Navbar;