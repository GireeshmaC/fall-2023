// SignUp.js

import React, { useState } from 'react';
import './SignUp.css'; // Create a new CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faL } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Backdrop, CircularProgress } from '@material-ui/core';
import { toast } from 'react-toastify';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rePasswordError, setRePasswordError] = useState('');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowRePassword = () => {
    setShowRePassword(!showRePassword);
  };

  const handleSignUp = () => {
    setLoading(true);
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setRePasswordError('');

    if (firstName === '') {
      setFirstNameError('First Name is required');
      setLoading(false)
      return;
    }

    if (lastName === '') {
      setLastNameError('Last Name is required');
      setLoading(false)
      return;
    }

    if (email === '') {
      setEmailError('Email is required');
      setLoading(false)
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      setLoading(false)
      return;
    }

    if (password === '') {
      setPasswordError('Password is required');
      setLoading(false)
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      setLoading(false)
      return;
    }

    if (rePassword === '') {
      setRePasswordError('Re-enter Password is required');
      setLoading(false)
      return;
    }

    if (rePassword !== password) {
      setRePasswordError('Passwords do not match');
      setLoading(false)
      return;
    }

    // Implement your sign-up logic here
    const data = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password
    }

    axios({
      url: 'http://localhost:5000/v1/auth/user/register',
      method: 'POST',
      data: data,
      headers: {
        // 'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        navigate('/check-email')
        console.log("Successfully registered");
        setLoading(false)
        toast.success("Successfully registered, Please check email to verify", {
          position: toast.POSITION.BOTTOM_LEFT
        })
      }).catch(e => {
        console.log(e)
        setLoading(false)
        toast.error("Error occured while signing up", {
          position: toast.POSITION.BOTTOM_LEFT
        })
      })


    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Re-enter Password:', rePassword);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  return (
    <>
      {
        loading ? <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }
          }
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop >
          :
          <div className="signup-container">
            <div className="signup-form">
              <h2>Sign Up</h2>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={handleFirstNameChange}
                />
              </div>
              {firstNameError && <p className="error-message">{firstNameError}</p>}
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={handleLastNameChange}
                />
              </div>
              {lastNameError && <p className="error-message">{lastNameError}</p>}
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              {emailError && <p className="error-message">{emailError}</p>}
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <span className="password-toggle" onClick={toggleShowPassword}>
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </span>
              </div>
              {passwordError && <p className="error-message">{passwordError}</p>}
              <div className="input-group">
                <input
                  type={showRePassword ? 'text' : 'password'}
                  placeholder="Re-enter Password"
                  value={rePassword}
                  onChange={handleRePasswordChange}
                />
                <span className="password-toggle" onClick={toggleShowRePassword}>
                  {showRePassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </span>
              </div>
              {rePasswordError && <p className="error-message">{rePasswordError}</p>}
              <button className="signup-button" onClick={handleSignUp}>
                Sign Up
              </button>
              <pre>Already have an account?</pre>
              <Link to="/login">
                <a>Login</a>
              </Link>
            </div>
          </div>
      }
    </>
  );
}

export default SignUp;
