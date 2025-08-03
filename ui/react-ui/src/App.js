import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import CourseContent from './CourseContent';
import Lesson from './Lesson';
import Login from './Login';
import Register from './Register';
import Statistics from './Statistics';

function Nav({ isLogged, username, checkLoginStatus }) {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [mainMenuOpen, setMainMenuOpen] = React.useState(false);

    const handleLogout = () => {
        setMenuOpen(false);
        setMainMenuOpen(false);
        fetch('/api/auth/logout').then(() => {
            checkLoginStatus();
        });
    };

    return (
        <>
            <AppBar position="relative">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={() => setMainMenuOpen(true)}
                        style={mainMenuOpen ? { display: 'none' } : {}}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div style={mainMenuOpen ? { paddingLeft: '192px' } : {}}>
                        <Button color="inherit" component={Link} to="/">Security Gym</Button>
                    </div>

                    <span style={{ marginLeft: 'auto' }}>
                        {!isLogged ? (
                            <>
                                <Button color="inherit" component={Link} to="/login">Sign In</Button>
                                <Button color="inherit" variant="outlined" component={Link} to="/register">Sign Up</Button>
                            </>
                        ) : (
                            <>
                                <Menu
                                    open={menuOpen}
                                    onClose={() => setMenuOpen(false)}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                                <Button color="inherit" onClick={() => setMenuOpen(true)}>{username}</Button>
                            </>
                        )}
                    </span>
                </Toolbar>
            </AppBar>

            <Drawer variant="persistent" anchor="left" open={mainMenuOpen}>
                <div style={{ width: '192px' }}>
                    <IconButton onClick={() => setMainMenuOpen(false)}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <Divider />
                    <List>
                        <ListItem button component={Link} to="/statistics">
                            <ListItemText primary="Statistics" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </>
    );
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: false,
            username: ''
        };
    }

    componentDidMount() {
        this.checkLoginStatus();
    }

    checkLoginStatus = () => {
        fetch('/api/auth/username')
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error("You are not logged");
                }
            })
            .then((data) => {
                this.setState({
                    isLogged: true,
                    username: data.username
                });
            })
            .catch(() => {
                this.setState({
                    isLogged: false,
                    username: ''
                });
            });
    };

    render() {
        const { isLogged, username } = this.state;
        return (
            <Router>
                <Nav
                    isLogged={isLogged}
                    username={username}
                    checkLoginStatus={this.checkLoginStatus}
                />
                <Routes>
                    <Route path="/" element={<CourseContent />} />
                    <Route path="/courses" element={<CourseContent />} />
                    <Route path="/courses/:courseSlug" element={<CourseContent />} />
                    <Route
                        path="/courses/:courseSlug/:lessonSlug"
                        element={<Lesson isLogged={isLogged} />}
                    />
                    <Route
                        path="/login"
                        element={<Login checkLoginStatus={this.checkLoginStatus} />}
                    />
                    <Route path="/register" element={<Register />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/statistics/:courseSlug" element={<Statistics />} />
                </Routes>
            </Router>
        );
    }
}

export default App;
