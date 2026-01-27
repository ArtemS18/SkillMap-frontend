import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/esm/Navbar";
import './NavBar.css'
import { NavLink } from "react-router-dom";

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
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;