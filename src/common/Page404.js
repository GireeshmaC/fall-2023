import React from 'react'
import {
    Container,
    Paper,
    Divider,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

function Page404() {
    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{padding: "20px",
    marginTop: "40px",
    backgroundColor: "#00000090"}}>
                <h2>404</h2>
                <Divider style={{ margin: '20px 0' }} />
                <h2>Page Not found</h2>
                <pre>Best thing to do, when lost</pre>
                <Link to="/">
                    <a>Go Home</a>
                </Link>
            </Paper>
        </Container>
    )
}

export default Page404