import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "./NavigationBar.css";

const NavigationBar = ({ user }) => {
  const [expanded, setExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setExpanded(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      setShowLogoutModal(false);
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <>
      <Navbar expanded={expanded} onToggle={setExpanded} expand="lg" className="custom-navbar sticky-top glass-panel" style={{ border: 'none', borderRadius: 0 }}>
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          className="brand-logo fw-bold fs-3"
          onClick={() => setExpanded(false)}
        >
          <span className="text-gradient">🚀 SkillForge</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-start align-items-lg-center px-3 px-lg-0 pb-3 pb-lg-0">
            {user ? (
              <>
                <Nav.Link as={NavLink} to="/" className="nav-item-link w-100 mt-2 mt-lg-0" onClick={() => setExpanded(false)}>Home</Nav.Link>
                <Nav.Link as={NavLink} to="/dashboard" className="nav-item-link w-100 mt-2 mt-lg-0" onClick={() => setExpanded(false)}>Dashboard</Nav.Link>
                <Nav.Link as={NavLink} to="/roadmap" className="nav-item-link w-100 mt-2 mt-lg-0" onClick={() => setExpanded(false)}>Roadmap</Nav.Link>
                <Nav.Link as={NavLink} to="/notes" className="nav-item-link w-100 mt-2 mt-lg-0" onClick={() => setExpanded(false)}>Notes</Nav.Link>
                <Nav.Link as={NavLink} to="/skills" className="nav-item-link w-100 mt-2 mt-lg-0" onClick={() => setExpanded(false)}>Skills</Nav.Link>
                <Nav.Link as={NavLink} to="/projects" className="nav-item-link w-100 mt-2 mt-lg-0" onClick={() => setExpanded(false)}>Projects</Nav.Link>
                <Nav.Link as={NavLink} to="/resume" className="nav-item-link w-100 mt-2 mt-lg-0" onClick={() => setExpanded(false)}>Resume</Nav.Link>
                <Nav.Link as={NavLink} to="/interview" className="nav-item-link w-100 mt-2 mt-lg-0" onClick={() => setExpanded(false)}>Interview</Nav.Link>
                <Nav.Link as={NavLink} to="/profile" className="nav-item-link w-100 mt-2 mt-lg-0" onClick={() => setExpanded(false)}>Profile</Nav.Link>
                <button onClick={handleLogoutClick} className="btn btn-outline-danger ms-lg-3 mt-3 mt-lg-0 w-100 w-lg-auto">Logout</button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className="nav-item-link w-100 mt-2 mt-lg-0" onClick={() => setExpanded(false)}>Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="nav-item-link w-100 mt-2 mt-lg-0" onClick={() => setExpanded(false)}>Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavigationBar;