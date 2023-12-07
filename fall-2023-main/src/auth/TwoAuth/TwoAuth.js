import React, { useEffect, useState } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Divider,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { Check } from '@material-ui/icons'
import './TwoAuth.css'

import { useDispatch, useSelector } from 'react-redux'
import {
  clearQr,
  enableTFA,
  getCode,
  getQr,
  logout,
  setUser,
  selectUser,
  selectTempUser,
  setTempUser,
} from '../../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function TwoAuth() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const [loading, setLoading] = useState(false)

  // const user = useSelector(selectUser);
  const tempUser = useSelector(selectTempUser)
  const qrCode = useSelector(getQr)
  const q_code = useSelector(getCode)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!tempUser) {
      navigate('/')
    }
  }, [tempUser])

  const handleOtpChange = (index, value) => {
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Automatically move focus to the next input field
      if (index < otp.length - 1 && newOtp[index] != '') {
        const nextInput = document.getElementById(`otp-input-${index + 1}`)
        if (nextInput) {
          nextInput.focus()
        }
      }
    } else if (value === '' && index > 0) {
      // Handle backspace by moving focus to the previous input
      const newOtp = [...otp]
      newOtp[index] = ''
      setOtp(newOtp)
      if (index > 0) {
        const previousInput = document.getElementById(`otp-input-${index - 1}`)
        if (previousInput) {
          previousInput.focus()
        }
      }
    }
  }

  const handleSubmit = () => {
    setLoading(true)
    const enteredOtp = otp.join('')
    console.log('Entered OTP:')
    axios({
      url: 'http://localhost:5000/v1/auth/user/verifyOtp',
      method: 'POST',
      data: {
        otp: enteredOtp,
        code: q_code,
      },
    })
      .then((res) => {
        if (res.status == 200) {
          dispatch(clearQr())
          dispatch(enableTFA())
          dispatch(setUser(tempUser))
          dispatch(setTempUser(null))
          navigate('/admin-view')

          toast.success('Logged In successfully', {
            position: toast.POSITION.BOTTOM_LEFT,
          })
          setLoading(false)
        } else {
          toast.error('Invalid OTP', {
            position: toast.POSITION.BOTTOM_LEFT,
          })
          setLoading(false)
          dispatch(logout())
          dispatch(clearQr())
          navigate('/login')
        }
      })
      .catch((e) => {
        toast.error('Error occured while two factor Auth', {
          position: toast.POSITION.BOTTOM_LEFT,
        })
        setLoading(false)
        console.log(e)
        dispatch(logout())
        dispatch(clearQr())
        navigate('/login')
      })
    setOtp(['', '', '', '', '', ''])
  }

  return (
    <>
      {loading ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Container maxWidth="sm">
          <h2>
            Welcome {tempUser && tempUser.firstname} {tempUser && tempUser.lastname}
          </h2>
          <Paper
            elevation={3}
            style={{
              backgroundColor: '#00000090',
              padding: '20px',
              marginTop: '20px',
            }}
          >
            <pre>Scan QRCode using google authenticator</pre>
            <div
              className="QrDiv"
              dangerouslySetInnerHTML={{ __html: qrCode }}
            />
            <Divider style={{ margin: '20px 0' }} />
            <pre>(&then)Enter the One Time Password</pre>
            <div style={{ padding: '20px' }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  className={'otpTextField'}
                  variant="outlined"
                  size="small"
                  type="text"
                  value={digit}
                  inputProps={{ maxLength: 1 }}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  id={`otp-input-${index}`}
                />
              ))}
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              startIcon={<Check />}
            >
              Confirm
            </Button>
          </Paper>
        </Container>
      )}
    </>
  )
}

export default TwoAuth
