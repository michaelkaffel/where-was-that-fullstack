import { useState, useRef, useEffect } from 'react';
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
import wwtLogo from '../app/images/wwt-logo.png'

library.add(fas)

function Navigationbar() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    

    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const navRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setExpanded(false);
        dispatch(clearCurrentUser());
        navigate('/');
    }

    const dropdownTitle = (
        <span>
            <FontAwesomeIcon icon='fa-solid fa-list-check' /> Saved Locations
        </span>
    )
    return (
        <div ref={navRef}>
            <Navbar
                expand="lg"
                bg='dark'
                className='navbar-styles'
                data-bs-theme="dark"
                fixed="top"
                expanded={expanded}
                onToggle={setExpanded}
            >
                <Container>
                    <Navbar.Brand to='/' as={Link}>
                        <img 
                            src={wwtLogo}
                            alt='Where Was That'
                            height='30'
                            className='d-inline-block align-middle me-2'
                        />
                        Where Was That?
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {/* <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                                <FontAwesomeIcon icon={user ? ("fa-solid fa-gauge-high") : ("fa-solid fa-house")} size="lg" />
                                {user ? (
                                    'Dashboard'
                                ) : ('Home')}
                            </Nav.Link> */}

                            

                            {user && (
                                <>
                                    <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                                        <FontAwesomeIcon icon='fa-solid fa-house' size='lg'/>
                                        Dashboard
                                    </Nav.Link>

                                    <Nav.Link as={Link} to="/add-locations" onClick={() => setExpanded(false)}>
                                        <FontAwesomeIcon icon='fa-solid fa-file' size='lg' />
                                        Add Locations
                                    </Nav.Link>

                                    <NavDropdown title={dropdownTitle} id="basic-nav-dropdown">

                                        <NavDropdown.Item as={Link} to='/hiking-trails' onClick={() => setExpanded(false)}>
                                            Hiking Trails</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to='/camping-spots' onClick={() => setExpanded(false)}>
                                            Camping Spots
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to='/scenic-overlooks' onClick={() => setExpanded(false)}>
                                            Scenic Lookouts
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            )}
                        </Nav>

                        <Nav>
                            {user ? (
                                <>
                                    <Navbar.Text as={Link} to='/profile' className='me-3' onClick={() => setExpanded(false)}>
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
            <SignupModal show={showSignup} onHide={() => setShowSignup(false)} />
        </div>


    );
}

export default Navigationbar;
