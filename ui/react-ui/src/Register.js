import React from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from "react-router-dom";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error_message: '',
            show_error_message: false
        };
    }

    handleSignUp(event) {
        event.preventDefault();

        fetch('/api/auth/register', {
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
            if (response.status === 400) {
                return response.json().then(json => {
                    throw new Error(json.error);
                });
            } else if (response.status === 200) {
                this.props.navigate("/login");
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
            <div>
                <Container maxWidth="xs">
                    <Typography component="h1" variant="h2">
                        Sign Up
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
                        onClick={(event) => this.handleSignUp(event)}
                    >
                        Sign Up
                    </Button>
                </Container>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={6000}
                    message={this.state.error_message}
                    open={this.state.show_error_message}
                    onClose={() => this.setState({ show_error_message: false })}
                />
            </div>
        );
    }
}

function RegisterWithRouter(props) {
    const navigate = useNavigate();
    return <Register {...props} navigate={navigate} />;
}

export default RegisterWithRouter;
