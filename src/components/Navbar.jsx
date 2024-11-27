import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faRightFromBracket, faPowerOff ,faHouse } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isDoctor } = useAuthContext();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">DocSearch</Link>
      <div className="nav-right">
        <Link to="/">
          <FontAwesomeIcon icon={faHouse} />
        </Link>
        <Link to="/#services">Services</Link>
        <Link to="/#contact">Contact</Link>
        {isAdmin && <Link to="/admin">Admin Page</Link>}
        {isDoctor && <Link to="/doctor">Doctor Page</Link>}
        <div className="button-container">
        {user ? (
          <Link to="/" >
            <button onClick={logout} className="logout-button">
              <FontAwesomeIcon icon={faPowerOff} /> Logout
            </button>
          </Link>
        ) : (
          <Link to="/login" >
            <button className="login-button">
              <FontAwesomeIcon icon={faRightToBracket} /> Login
            </button>
          </Link>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;