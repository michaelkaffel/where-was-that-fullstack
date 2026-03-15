import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { selectCurrentUser, clearCurrentUser } from '../features/user/userSlice';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

library.add(fas)

function Navigationbar() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);

    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    const handleLogout = () => {
        dispatch(clearCurrentUser());
        navigate('/');
    }

    const dropdownTitle = (
        <span>
            <FontAwesomeIcon icon='fa-solid fa-list-check' /> Saved Locations
        </span>
    )
    return (
        <>
            <Navbar expand="lg" bg='dark' className='navbar-styles' data-bs-theme="dark" fixed="top" >
                <Container>
                    <Navbar.Brand to='/' as={Link} >Where Was That?</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">
                                <FontAwesomeIcon icon="fa-solid fa-house" size="lg" />
                                Home
                            </Nav.Link>

                            {user && (
                                <>
                                    <Nav.Link as={Link} to="/add-locations">
                                        <FontAwesomeIcon icon='fa-solid fa-file' size='lg' />
                                        Add Locations
                                    </Nav.Link>

                                    <NavDropdown title={dropdownTitle} id="basic-nav-dropdown">

                                        <NavDropdown.Item as={Link} to='/hiking-trails'>
                                            Hiking Trails</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to='/camping-spots'>
                                            Camping Spots
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to='/scenic-overlooks'>
                                            Scenic Lookouts
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            )}
                        </Nav>

                        <Nav>
                            {user ? (
                                <>
                                    <Navbar.Text as={Link} to='/profile' className='me-3'>
                                        <FontAwesomeIcon icon='fa-solid fa-user' size='lg' /> {user.username}
                                    </Navbar.Text>
                                    <Nav.Link onClick={handleLogout}>
                                        <FontAwesomeIcon icon='fa-solid fa-right-from-bracket' size='lg' /> Log Out
                                    </Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link onClick={() => setShowLogin(true)}>
                                        <FontAwesomeIcon icon='fa-solid fa-user' size='lg' /> Log In
                                    </Nav.Link>
                                    <Nav.Link onClick={() => setShowSignup(true)}>
                                        <FontAwesomeIcon icon='fa-solid fa-user-plus' size='lg' /> Sign Up
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
            <SignupModal show={showSignup} onHide={() => setShowSignup(false)}/>
        </>


    );
}

export default Navigationbar;
