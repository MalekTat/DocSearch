import React from "react";
import "../styles/Login.css"; // Link the external CSS file for styling

const Login = () => {
  return (
    <div className="login-page">
    <div className="login-container">
      <h1>Account Login</h1>
      <form>
        <input
          type="text"
          placeholder="Username"
          name="username"
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
        />
        <>  </>
        <button type="submit">Log In</button>
      </form>
    </div>
    </div>
  );
};

export default Login;