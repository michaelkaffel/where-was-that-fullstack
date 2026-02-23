import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas)





function Navigationbar() {

  const dropdownTitle = (
    <span>
      <FontAwesomeIcon icon='fa-solid fa-list-check'/> Saved Locations
    </span>
  )
  return (
    <Navbar expand="md" bg='dark' className='navbar-styles' data-bs-theme="dark" fixed="top" >
      <Container>
        <Navbar.Brand to='/' as={Link} >Where Was That?</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
            <FontAwesomeIcon icon="fa-solid fa-house" size="lg"  />
            Home
            </Nav.Link>
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigationbar;
