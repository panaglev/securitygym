import React from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error_message: '',
            show_error_message: false
        };
    }

    handleSignIn(event) {
        event.preventDefault();

        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then((response) => {
            if (response.status === 403) {
                return response.json().then(json => {
                    throw new Error(json.error);
                });
            } else if (response.status === 200) {
                this.props.checkLoginStatus();
                this.props.navigate("/");
            }
        }).catch((error) => {
            this.setState({
                error_message: error.message,
                show_error_message: true
            });
        });
    }

    render() {
        return (
            <Container maxWidth="xs">
                <Typography component="h1" variant="h2">
                    Sign In
                </Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="username"
                    id="username"
                    label="Username"
                    autoComplete="username"
                    autoFocus
                    onChange={(event) => this.setState({ username: event.target.value })}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    id="password"
                    label="Password"
                    type="password"
                    onChange={(event) => this.setState({ password: event.target.value })}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={(event) => this.handleSignIn(event)}
                >
                    Sign In
                </Button>
                <Grid container>
                    <Grid item>
                        <Link component={RouterLink} to="/register">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

function LoginWithNavigate(props) {
    const navigate = useNavigate();
    return <Login {...props} navigate={navigate} />;
}

export default LoginWithNavigate;
