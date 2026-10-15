import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button, Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setExpanded(false);
    navigate('/');
  };

  const closeNavbar = () => setExpanded(false);

  return (
    <Navbar className="custom-navbar" expand={false} expanded={expanded} onToggle={setExpanded} sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={closeNavbar}>
          MediTech
        </Navbar.Brand>
        <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse>
          <Nav className="ms-auto">

            {!isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/login" onClick={closeNavbar}>Connexion</Nav.Link>
                <Nav.Link as={Link} to="/signup" onClick={closeNavbar}>Inscription</Nav.Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/pages/user/profil" onClick={closeNavbar}>Profil</Nav.Link>

                {(userRole !== 'ADMIN' && userRole !== 'MEDECIN') && (
                  <>
                    <Nav.Link as={Link} to="/pages/user/rdv" onClick={closeNavbar}>Rendez-vous</Nav.Link>
                    <Nav.Link as={Link} to="/pages/user/historique" onClick={closeNavbar}>Historique</Nav.Link>
                    <Nav.Link as={Link} to="/pages/user/dossier" onClick={closeNavbar}>Dossier Médical</Nav.Link>
                  </>
                )}
                {(userRole === 'MEDECIN' || userRole === 'PATIENT') && (
                  <>
                    <Nav.Link as={Link} to="/pages/messagerie" onClick={closeNavbar}>Messagerie</Nav.Link>
                  </>
                )}

                <NavDropdown.Divider style={{ borderTop: '3px solid #ccc' }} />
                <Nav.Link onClick={handleLogout}>Déconnexion</Nav.Link>
              </>
            )}

            {userRole === 'ADMIN' && (
              <NavDropdown title="Admin" align="end">
                <NavDropdown.Item as={Link} to="/admin/dashboard" onClick={closeNavbar}>
                  Dashboard
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {userRole === 'MEDECIN' && (
              <NavDropdown title="Médecin" align="end">
                <NavDropdown.Item as={Link} to="/medecin/dossiers" onClick={closeNavbar}>
                  Dossiers Médicaux
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/medecin/rdvs" onClick={closeNavbar}>
                  Rendez-vous
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
