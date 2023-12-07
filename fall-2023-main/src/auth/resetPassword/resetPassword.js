import React, { useEffect, useState } from 'react'
import {
    Container,
    Paper,
    Backdrop,
    CircularProgress,
    Button,
    Divider,
} from '@material-ui/core';
import './resetPassword.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Check, Visibility, VisibilityOff } from '@material-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const [loading, setLoading] = useState(false)

    const { token } = useParams();

    const navigate = useNavigate();

    function handleSubmit(e) {
        setLoading(true)
        if (newPassword !== confirmPassword) {
            toast.error("Password and Confirm Password must match", {
                position: toast.POSITION.BOTTOM_LEFT
            })
            setLoading(false)
            return;
        }

        axios({
            url: `http://localhost:5000/v1/auth/user/resetPassword`,
            method: 'POST',
            data: {
                newPassword: newPassword,
                token: token
            }
        }).then(res => {
            if (res.status == 200) {
                setLoading(false)
                toast.success("Password reset success. Please login", {
                    position: toast.POSITION.BOTTOM_LEFT
                })
                navigate('/')
            }
        }).catch(e => {
            setLoading(false)
            toast.error("Error occured while processing", {
                position: toast.POSITION.BOTTOM_LEFT
            })
            console.log(e);
        })

        setNewPassword("");
        setConfirmPassword("");
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowRePassword = () => {
        setShowRePassword(!showRePassword);
    };

    useEffect(() => {
        console.log(token);
        if (!token) {
            toast.error("Invalid Token", {
                position: toast.POSITION.BOTTOM_LEFT
            })
            navigate('/')
        }
    }, [])

    return (
        <>
            {loading ? <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
                :
                <Container maxWidth="sm">
                    <Paper elevation={3} className='paper-div'>
                        <h2>Reset Password</h2>
                        <Divider style={{ margin: '20px 0' }} />

                        <div className="input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <span className="password-toggle" onClick={toggleShowPassword}>
                                {showPassword ? (
                                    <Visibility />
                                ) : (
                                    <VisibilityOff />
                                )}
                            </span>
                        </div>
                        <div className="input-group">
                            <input
                                type={showRePassword ? 'text' : 'password'}
                                placeholder="Re-enter Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span className="password-toggle" onClick={toggleShowRePassword}>
                                {showRePassword ? (
                                    <Visibility />
                                ) : (
                                    <VisibilityOff />
                                )}
                            </span>
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            startIcon={<Check />}
                        >
                            Confirm
                        </Button>
                    </Paper>
                </Container>
            }
        </>
    )
}

export default ResetPassword