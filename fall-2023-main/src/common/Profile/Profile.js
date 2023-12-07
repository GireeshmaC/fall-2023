import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Backdrop,
    CircularProgress,
    Button,
    Divider,
    Grid,
} from '@material-ui/core';
import { Edit, Save, Cancel, Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import './Profile.css'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/userSlice'
import axios from 'axios';
import { toast } from 'react-toastify'


// const PROFILEDATA = {
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'johndoe@example.com',
// }

function Profile() {

    const user = useSelector(selectUser)

    const [editMode, setEditMode] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setFirstName(user?.firstname || "");
            setLastName(user?.lastname || "");
        }
    }, [])

    const toggleEditMode = () => {
        if (!editMode && showChangePassword) {
            setShowChangePassword(false);
        }
        setFirstName(user?.firstname || "");
        setLastName(user?.lastname || "");
        setEditMode(!editMode);
    };

    const handleSave = () => {
        setLoading(true);
        axios({
            url: 'http://localhost:5000/v1/user/updateProfile',
            method: "POST",
            data: {
                firstName: firstName,
                lastName: lastName
            },
            headers: {
                authorization: `Bearer ${user && user.accessToken}`,
            }
        })
            .then((res) => {
                console.log(res);
                setLoading(false)
                toast.success("Successfully updated profile", {
                    position: toast.POSITION.BOTTOM_LEFT
                })
            }).catch(e => {
                setLoading(false)
                toast.error("Error while updating profile", {
                    position: toast.POSITION.BOTTOM_LEFT
                })
                console.log(e)
            })
        setEditMode(false);
    };

    const handleUpdatePassword = () => {
        setLoading(true)
        axios({
            url: 'http://localhost:5000/v1/user/changePassword',
            method: "POST",
            data: {
                oldPassword: currentPassword,
                newPassword: newPassword
            },
            headers: {
                authorization: `Bearer ${user && user.accessToken}`,
            }
        }).then((res) => {
            setLoading(false)
            toast.success('Successfully updated the password', {
                position: toast.POSITION.BOTTOM_LEFT
            })
            console.log('Successfully updated the password');
        }).catch(e => {
            setLoading(false)
            toast.error("Error occured while updating the password", {
                position: toast.POSITION.BOTTOM_LEFT
            })
            console.log(e)
        })
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowChangePassword(true);
    }

    const handleChangePassword = () => {
        if (editMode) {
            toggleEditMode();
        }
        setShowChangePassword(true);
    };

    const toggleShowCurrentPassword = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowRePassword = () => {
        setShowRePassword(!showRePassword);
    };

    const handleCancelPasswordChange = () => {
        setShowChangePassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
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
                <Container maxWidth="sm" >
                    <Paper elevation={3} className='container-div' style={{ padding: '20px', marginTop: '20px' }}>
                        <h2>My Profile</h2>
                        <Divider style={{ margin: '20px 0' }} />

                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                readOnly={!editMode}
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                readOnly={!editMode}
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Email"
                                value={user && user.email}
                                readOnly={true}
                            />
                        </div>

                        {!editMode ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={toggleEditMode}
                                startIcon={<Edit />}
                            >
                                Edit Profile
                            </Button>
                        ) : (
                            <div className='passwordActionBtsGrp'>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={toggleEditMode}
                                    startIcon={<Cancel />}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                    startIcon={<Save />}
                                >
                                    Save
                                </Button>
                            </div>
                        )}

                        {
                            !showChangePassword &&
                            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Lock />}
                                        onClick={handleChangePassword}
                                    >
                                        Update Password
                                    </Button>
                                </Grid>
                            </Grid>
                        }

                        {showChangePassword && (
                            <>
                                <div className="input-group">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        placeholder="Current Password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <span className="password-toggle" onClick={toggleShowCurrentPassword}>
                                        {showCurrentPassword ? (
                                            <Visibility />
                                        ) : (
                                            <VisibilityOff />
                                        )}
                                    </span>
                                </div>
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
                                <div className="passwordActionBtsGrp">
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleCancelPasswordChange}
                                        startIcon={<Cancel />}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleUpdatePassword} variant="contained" color="primary" startIcon={<Save />}>
                                        Save Password
                                    </Button>
                                </div>
                            </>
                        )}
                    </Paper>
                </Container>
            }
        </>
    );
}

export default Profile;
