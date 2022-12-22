import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import charterWhiteLogo from "../Assets/charter-logo-white.svg";

function Header() {
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="alert" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={charterWhiteLogo}
              // width="30"
              height="50"
              className="d-inline-block align-top"
              alt="Charter Logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
            <Nav>
              <Button variant="dark" style={{ marginRight: "1rem" }}>Login</Button>
              <Button variant="light">Sign Up</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default Header;
