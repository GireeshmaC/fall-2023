import React, { useState } from 'react';
import {
    Container,
    Paper,
    Backdrop,
    CircularProgress,
    Button,
    Divider,
} from '@material-ui/core';
import { SendOutlined } from '@material-ui/icons';
import './ForgotPassword.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function ForgotPassword() {

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false)

    const handleSubmit = () => {
        setLoading(true)
        axios({
            url: 'http://localhost:5000/v1/auth/user/resetPasswordLink',
            method: 'POST',
            data: {
                email: email
            }
        }).then(res => {
            if (res.status == 200) {
                toast.warn("Please check the mail for reset link", {
                    position: toast.POSITION.BOTTOM_LEFT
                })
                setLoading(false)
            } else {
                toast.error("Error occured!! Please try again", {
                    position: toast.POSITION.BOTTOM_LEFT
                })
                setLoading(false)
            }
        }).catch(e => {
            toast.error("Error occured!! Please try again", {
                position: toast.POSITION.BOTTOM_LEFT
            })
            setLoading(false)
            console.log(e);
        })
        setEmail("");
    }

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
                        <h2>Forgot Password</h2>
                        <Divider style={{ margin: '20px 0' }} />

                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            startIcon={<SendOutlined />}
                        >
                            Send Mail
                        </Button>
                        <pre>Get back to login? </pre>
                        <Link to="/login">
                            <a>back</a>
                        </Link>
                    </Paper>
                </Container>
            }
        </>
    )
}

export default ForgotPassword