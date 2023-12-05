import React, { useEffect, useState } from 'react';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import ReCAPTCHA from "react-google-recaptcha";

import { useDispatch } from 'react-redux';
import { selectUser, setTempUser, setQr } from '../../redux/userSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { Backdrop, CircularProgress } from '@material-ui/core';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loading, setLoading] = useState(false);
  const [isCaptchaSuccessful, setIsCaptchaSuccess] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (user != null && user.isAdmin) {
      navigate('/admin-view')
    } else if (user != null) {
      navigate('/search-page')
    }
  }, [loading])

  const onCaptchaChange = (value) => {
    setIsCaptchaSuccess(true)
    console.log("captcha value: ", value);
  }

  const handleLogin = () => {
    setLoading(true);
    setEmailError('');
    setPasswordError('');

    if (email === '') {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    if (password === '') {
      setPasswordError('Password is required');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    // Implement your login logic here
    const data = {
      email: email,
      password: password
    }

    axios({
      url: 'http://localhost:5000/v1/auth/user/login',
      method: 'POST',
      data: data,
      headers: {
        // 'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status == 200) {
          console.log(response);
          if (!response.data.user) {
            toast.error(response.data.message, {
              position: toast.POSITION.BOTTOM_LEFT
            })
            setLoading(false)
            return;
          }
          else if (!response.data.user.isVerified) {
            toast.error("Admin hasn't verified your account yet", {
              position: toast.POSITION.BOTTOM_LEFT
            })
            setLoading(false)
            return;
          } else if (!response.data.user.isEmailVerified) {
            toast.error("Email hasn't verified please check past emails", {
              position: toast.POSITION.BOTTOM_LEFT
            })
            setLoading(false)
            return;
          }
          dispatch(setTempUser(response.data.user))
          dispatch(setQr({
            QrCode: response.data.QrCode,
            code: response.data.code
          }))
          setLoading(false)
          navigate('/two-auth')
          console.log("Successfully Login");
        } else {
          console.log("Error occured while loggin in", response.data.message);
          toast.error(response.data.message, {
            position: toast.POSITION.BOTTOM_LEFT
          })
          setLoading(false)
        }
      }).catch(e => {
        console.log(e);
        toast.error(e.message, {
          position: toast.POSITION.BOTTOM_LEFT
        })
        setLoading(false)
      })
    setIsCaptchaSuccess(false)
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  return (

    <>

      {loading ? <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
        :
        <div className="login-container">
          <div className="login-form">
            <h2>Login</h2>
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ReCAPTCHA
                sitekey="6Lfl_iUpAAAAAJQRbaPBqzkARoQd5egMDGjEQ6uB"
                onChange={onCaptchaChange}
              />
            </div>
            <button disabled={!isCaptchaSuccessful} className={`signup-button ${!isCaptchaSuccessful && `btn_disabled`}`} onClick={handleLogin}>
              Login
            </button>
            <pre>Don't have an account ? </pre>
            <Link to="/signup">
              <a>Sign Up</a>
            </Link>
            <pre>Having trouble recalling the password ? </pre>
            <Link to="/forgot-password">
              <a>Forgot Password</a>
            </Link>
          </div>
        </div>
      }
    </>
  );
}

export default Login;