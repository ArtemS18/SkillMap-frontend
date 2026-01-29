import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/esm/Navbar";
import './NavBar.css'
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { logout } from "../api/api";

function NavBar() {
  return (
    <Navbar expand="lg" className="navbar-class bg-body-tertiary" >
      <Container>
        <Navbar.Brand  
            as={NavLink}
            to="/"> 
            SillMap
        </Navbar.Brand>
        <Navbar.Toggle />
       
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto justify-content-between w-100">
                <Nav className="me-auto">
                    <Nav.Link as={NavLink} to="/graph">Мой прогресс</Nav.Link>
                    <Nav.Link as={NavLink} to="/">Мой роадмап</Nav.Link>
                </Nav>
                <Navbar.Text>
                  <a onClick={()=>logout()}href="/login">Выйти</a>
                </Navbar.Text>
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;