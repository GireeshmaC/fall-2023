// AdminView.js

import React, { useEffect, useState } from 'react'
// import {
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Snackbar,
// } from '@material-ui/core'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert'
import './AdminView.css'
import axios from 'axios'

import { useSelector } from 'react-redux'
import { selectUser } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function AdminView() {
  const [users, setUsers] = useState([])
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const user = useSelector(selectUser)

  const navigate = useNavigate()

  useEffect(() => {

    if (user == null) {
      navigate('/')
    } else if (!user.isAdmin) {
      navigate('/search-page')
    }

    axios({
      url: 'http://localhost:5000/v1/admin/getVerificationUsers',
      method: 'GET',
      headers: {
        authorization: `Bearer ${user && user.accessToken}`,
      }
    }).then(res => {
      const fetchedUsers = []
      for (let i = 1; i <= res.data.users.length - 1; i++) {
        fetchedUsers.push({
          id: res.data.users[i].id,
          firstname: res.data.users[i].firstname,
          lastname: res.data.users[i].lastname,

          email: res.data.users[i].email,

          approved: false,
          declined: false,
        })
      }
      setUsers(fetchedUsers)
    }).catch(e => {
      console.log(e);
    })
  }, [])

  const handleApprove = (userId) => {
    let currentUser = null;
    axios({
      url: `http://localhost:5000/v1/admin/approveUser/${userId}`,
      method: 'PUT',
      headers: {
        authorization: `Bearer ${user && user.accessToken}`,
      }
    })
      .then((res) => {
        const updatedUsers = users.map((user) => {
          if (user.id === userId) {
            currentUser = user
            user.approved = true;
            user.declined = false;
          }
          return user;
        });
        setUsers(updatedUsers);
        setSnackbarMessage(`User ${currentUser.firstname} has been approved.`);
        setOpenSnackbar(true);
        toast.success(`User ${currentUser.firstname} has been approved.`, {
          position: toast.POSITION.BOTTOM_LEFT
        })
      })
      .catch((e) => {
        toast.error(`Error occured while approving`, {
          position: toast.POSITION.BOTTOM_LEFT
        })
        console.log(e)
      })

  };

  const handleDecline = (userId) => {
    let currentUser = null;
    axios({
      url: `http://localhost:5000/v1/admin/declineUser/${userId}`,
      method: 'PUT',
      headers: {
        authorization: `Bearer ${user && user.accessToken}`,
      }
    })
      .then((res) => {
        const updatedUsers = users.map((user) => {
          if (user.id === userId) {
            currentUser = user
            user.approved = false;
            user.declined = true;
          }
          return user;
        });
        setUsers(updatedUsers);
        setSnackbarMessage(`User ${currentUser.firstname} has been declined.`);
        setOpenSnackbar(true);
        toast.warn(`User ${currentUser.firstname} has been declined.`, {
          position: toast.POSITION.BOTTOM_LEFT
        })
      })
      .catch((e) => {
        toast.error(`Error occured while declining`, {
          position: toast.POSITION.BOTTOM_LEFT
        })
        console.log(e)
      })
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (

    <div>
      <h1>Users List</h1>
      <TableContainer component={Paper} className='admin-view'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className='cell-styling'><b>Name</b></TableCell>
              <TableCell className='cell-styling'><b>Email</b></TableCell>
              <TableCell className='cell-styling' colSpan="2"><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className='rowStyling'>
                <TableCell className='cell-styling'>{user.firstname} {user.lastname}</TableCell>
                <TableCell className='cell-styling'>{user.email}</TableCell>
                {user.approved ? (
                  <TableCell className='cell-styling'><Button variant="contained" color="primary" disabled>
                    Approved
                  </Button></TableCell>
                ) : user.declined ? (
                  <TableCell className='cell-styling'><Button variant="contained" color="secondary" disabled>
                    Declined
                  </Button></TableCell>
                ) : (
                  <>
                    <TableCell className='cell-styling'><Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleApprove(user.id)}
                    >
                      Approve
                    </Button></TableCell>
                    <TableCell className='cell-styling'><Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDecline(user.id)}
                    >
                      Decline
                    </Button></TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>

    // <div className="admin-view">
    //   <div className="card-list">
    //     {users.map((user) => (
    //       <Card key={user.id} variant="outlined" className="user-card">
    //         <CardContent>
    //           <h3>{user.firstname}</h3>
    //           <h3>{user.lastname}</h3>
    //           <p>Email: {user.email}</p>
    //         </CardContent>
    //         <CardActions className="actions">
    //           {user.approved ? (
    //             <Button variant="contained" color="primary" disabled>
    //               Approved
    //             </Button>
    //           ) : user.declined ? (
    //             <Button variant="contained" color="secondary" disabled>
    //               Declined
    //             </Button>
    //           ) : (
    //             <>
    //               <Button
    //                 variant="contained"
    //                 color="primary"
    //                 onClick={() => handleApprove(user.id)}
    //               >
    //                 Approve
    //               </Button>
    //               <Button
    //                 variant="contained"
    //                 color="secondary"
    //                 onClick={() => handleDecline(user.id)}
    //               >
    //                 Decline
    //               </Button>
    //             </>
    //           )}
    //         </CardActions>
    //       </Card>
    //     ))}
    //   </div>
    // </div>
  )
}

export default AdminView
