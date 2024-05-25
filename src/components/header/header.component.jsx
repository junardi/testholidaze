import { Fragment } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import styles from './header.styles.module.scss';
import { isAuthenticated } from "../../lib/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {

  const navigate = useNavigate();

  const doLogout = (evt) => {
    evt.preventDefault();
    console.log('lets logout');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar
      expand="lg"
      className={`${styles.headerContainer}`}
    >
      <Container>
        <Navbar.Brand className={styles.navbarBrand} href="/">Holidaze</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={styles.customNavbar}>
            <Nav.Link href="/">Home</Nav.Link>
            { !isAuthenticated() &&
              <Fragment>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </Fragment>
            }

            { isAuthenticated() &&
              <Nav.Link href={`/profile`}>Profile</Nav.Link>
            }

            { isAuthenticated() &&
              <Nav.Link className={styles.logout} href="#" onClick={(evt) => doLogout(evt)}>Logout</Nav.Link>
            }


            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                          <NavDropdown.Item href="#action/3.2">
                              Another action
                          </NavDropdown.Item>
                          <NavDropdown.Item href="#action/3.3">
                              Something
                          </NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="#action/3.4">
                              Separated link
                          </NavDropdown.Item>
                      </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );


};


export default Header;