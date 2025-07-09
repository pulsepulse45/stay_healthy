/* eslint-disable react-hooks/exhaustive-deps */
// Following code has been commented with appropriate comments for your reference.
import React, { useState, useEffect } from 'react';
// Apply CSS according to your design theme or the CSS provided in week 2 lab 2
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

const Login = () => {
  // State variables for email, password, and error message
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (sessionStorage.getItem("auth-token")) {
      navigate("/");
    }
  }, []);

  // Function to handle form submission
  const login = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors([]);

    // POST request to backend login API
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (json.authtoken) {
      sessionStorage.setItem('auth-token', json.authtoken);
      sessionStorage.setItem('email', email);
      navigate('/'); // SPA redirect
    } else {
      if (json.errors) {
        setErrors(json.errors.map(err => err.msg));
      } else {
        setErrors([json.error || "Invalid login credentials."]);
      }
    }
  };

  return (
    <div>
      <div className="container">
        <div className="login-grid">
          <div className="login-text">
            <h2>Login</h2>
          </div>
          <div className="login-text">
            Are you a new member?
            <span>
              <Link to="/signup" style={{ color: '#2190FF' }}>
                {" "}Sign Up Here
              </Link>
            </span>
          </div>
          <br />
          <div className="login-form">
            <form onSubmit={login}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                {/* Input field for email */}
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  aria-describedby="helpId"
                  required
                />
              </div>

              {/* Input field for password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Error messages */}
              {errors.length > 0 && (
                <div className="err" style={{ color: 'red' }}>
                  {errors.map((err, index) => (
                    <div key={index}>{err}</div>
                  ))}
                </div>
              )}

              <div className="btn-group">
                {/* Login button */}
                <button type="submit" className="btn btn-primary mb-2 mr-1 waves-effect waves-light">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
