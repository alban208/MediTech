import React, { useState, useEffect } from 'react';
import { notifySuccess, notifyError } from '../../scripts/notification';
import {
  Container, Row, Col,
  Dropdown, DropdownButton,
  Modal, Button, Form,
  Card
} from 'react-bootstrap';

const Dashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [patients, setPatients] = useState([]);
  const [specialites, setSpecialites] = useState([]);

  const [showAdmins, setShowAdmins] = useState(false);
  const [showMedecins, setShowMedecins] = useState(false);
  const [showSpecialites, setShowSpecialites] = useState(false);
  const [showPatients, setShowPatients] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showModalSpecialite, setShowModalSpecialite] = useState(false);
  const [showModalEditSpecialite, setShowModalEditSpecialite] = useState(false);
  const [showModalMedecin, setShowModalMedecin] = useState(false);
  const [showModalEditMedecin, setShowModalEditMedecin] = useState(false);
  const [roleToCreate, setRoleToCreate] = useState('');
  const [roleToDelete, setRoleToDelete] = useState('');
  const [roleToUpdate, setRoleToUpdate] = useState('');
  const [formData, setFormData] = useState({ id: '', prenom: '', nom: '', email: '', password: '' });
  const [medecinData, setMedecinData] = useState({ id: '', prenom: '', nom: '', email: '', password: '', specialite_id: '', location: '' });
  const [selectedSpecialite, setSelectedSpecialite] = useState('');
  const accessToken = localStorage.getItem('authToken');
  const fetchUsers = async () => {
    try {

      const res = await fetch('http://localhost:3001/admin/allUsers', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();
      setAdmins(data.admins);
      setMedecins(data.medecins);
      setPatients(data.patients || []);
      const specialitesData = await fetch('http://localhost:3001/admin/getAllSpecialites', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (!specialitesData.ok) throw new Error('Erreur réseau');
      const specialitesJson = await specialitesData.json();
      setSpecialites(specialitesJson || []);
    } catch (err) {
      console.error('Erreur chargement utilisateurs :', err);
    }
  };

  useEffect(() => {
    if (showAdmins || showMedecins || showPatients || showSpecialites) fetchUsers();
  }, [showAdmins, showMedecins, showPatients, showSpecialites, accessToken]);

  const handleCreate = async () => {
    try {
      let endpoint;
      if (roleToCreate === 'ADMIN') endpoint = '/admin/addAdmin';

      else endpoint = '/admin/addUser';

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création');
      }

      notifySuccess(`${roleToCreate} créé avec succès`);
      setShowModal(false);
      setFormData({ prenom: '', nom: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      notifyError('Erreur lors de la création');
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      let endpoint;
      if (roleToUpdate === 'ADMIN') endpoint = '/admin/updateAdmin';
      else endpoint = '/admin/updateUser';

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      notifySuccess(`${roleToUpdate} mis à jour avec succès`);
      setShowEditModal(false);
      setFormData({ id: '', prenom: '', nom: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      notifyError('Erreur lors de la mise à jour');
      console.error(err);
    }
  }

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setFormData({ id: '', prenom: '', nom: '', email: '', password: '' });
  }

  const handleDelete = async (id) => {
    try {
      let endpoint;
      if (roleToDelete === 'ADMIN') endpoint = '/admin/deleteAdmin';
      else endpoint = '/admin/deleteUser';
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }
      notifySuccess(`${roleToDelete} supprimé avec succès`);
      fetchUsers();
    } catch (error) {
      notifyError('Erreur lors de la suppression');
      console.error(error);
    }
  };

  const handleAddSpecialite = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/addSpecialite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom: selectedSpecialite })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout de la spécialité');
      }

      notifySuccess('Spécialité ajoutée avec succès');
      setShowModalSpecialite(false);
      setSelectedSpecialite('');
      fetchUsers();
    } catch (err) {
      notifyError('Erreur lors de l\'ajout de la spécialité');
      console.error(err);
    }
  }

  const handleEditSpecialite = async (  ) => {
    try {
      const response = await fetch('http://localhost:3001/admin/updateSpecialite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom: selectedSpecialite})
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour de la spécialité');
      }

      notifySuccess('Spécialité mise à jour avec succès');
      setShowModalEditSpecialite(false);
      setSelectedSpecialite('');
      fetchUsers();
    } catch (err) {
      notifyError('Erreur lors de la mise à jour de la spécialité');
      console.error(err);
    }
  }

  const handleCancelEditSpecialite = () => {
    setShowModalEditSpecialite(false);
    setSelectedSpecialite('');
  }

  const handleDeleteSpecialite = async (nom) => {
    try {
      const response = await fetch('http://localhost:3001/admin/deleteSpecialite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression de la spécialité');
      }

      notifySuccess("Spécialité supprimée avec succès");
      fetchUsers();
    } catch (err) {
      notifyError('Erreur lors de la suppression de la spécialité');
      console.error(err);
    }
  }

  const handleCreateMedecin = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/addMedecin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(medecinData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du médecin');
      }
      notifySuccess("Médecin créé avec succès");
      setShowModalMedecin(false);
      setMedecinData({ id: '', prenom: '', nom: '', email: '', password: '', specialite_id: '', location: '' });
      fetchUsers();
    } catch (error) {
      notifyError('Erreur lors de la création du médecin');
      console.error(error);
    }
  }
  const handleUpdateMedecin = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/updateMedecin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(medecinData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du médecin');
      }
      notifySuccess('Médecin mis à jour avec succès');
      setShowModalEditMedecin(false);
      setMedecinData({ id: '', prenom: '', nom: '', email: '', password: '', specialite_id: '', location: '' });
      fetchUsers();
    } catch (error) {
      notifyError('Erreur lors de la mise à jour du médecin');
      console.error(error);
    }
  }
  const handleCancelEditMedecin = () => {
    setShowModalEditMedecin(false);
    setMedecinData({ id: '', prenom: '', nom: '', email: '', password: '', specialite_id: '', location: '' });
  }
  const handleDeleteMedecin = async (id) => {
    try {
      const response = await fetch('http://localhost:3001/admin/deleteMedecin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression du médecin');
      }
      notifySuccess('Médecin supprimé avec succès');
      fetchUsers();
    } catch (error) {
      notifyError('Erreur lors de la suppression du médecin');
      console.error(error);
    }
  };



  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">Dashboard Administrateur</h1>

      <Row className="g-4">
        {/* Bloc Admins */}
        <Col md={3}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>Gestion des Admins</strong>
              <DropdownButton title="Options" size="sm" variant="secondary">
                <Dropdown.Item
                  onClick={() => {
                    setRoleToCreate("ADMIN");
                    setShowModal(true);
                  }}
                >
                  Créer un admin
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowAdmins(!showAdmins)}>
                  {showAdmins ? "Masquer la liste" : "Afficher la liste"}
                </Dropdown.Item>
              </DropdownButton>
            </Card.Header>
            {showAdmins && (
              <Card.Body>
                <ul className="list-group">
                  {admins.map((admin, i) => (
                    <li key={i} className="list-group-item">
                      {admin.prenom} {admin.nom} - {admin.email}
                      <div>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setRoleToUpdate("ADMIN");
                            setFormData({
                              id: admin.id,
                              prenom: admin.prenom,
                              nom: admin.nom,
                              email: admin.email,
                              password: ''
                            });
                            setShowEditModal(true);
                          }}
                        >
                          <p>Edit</p>
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setRoleToDelete("ADMIN");
                            handleDelete(admin.id);
                          }}
                        >
                          <p>Delete</p>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            )}
          </Card>
        </Col>

        {/* Bloc Médecins */}
        <Col md={3}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>Gestion des Médecins</strong>
              <DropdownButton title="Options" size="sm" variant="success">
                <Dropdown.Item
                  onClick={() => {
                    setShowModalMedecin(true);
                  }}
                >
                  Créer un médecin
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowMedecins(!showMedecins)}>
                  {showMedecins ? "Masquer la liste" : "Afficher la liste"}
                </Dropdown.Item>
              </DropdownButton>
            </Card.Header>
            {showMedecins && (
              <Card.Body>
                <ul className="list-group">
                  {medecins.map((med, i) => (
                    <li key={i} className="list-group-item">
                      {med.prenom} {med.nom} - {med.email}
                      <div>
                        <Button variant="warning" size="sm" className="me-2"
                          onClick={() => {
                            setMedecinData({
                              id: med.id,
                              prenom: med.prenom,
                              nom: med.nom,
                              email: med.email,
                              password: '',
                              specialite_id: med.specialite_id,
                              location: med.location
                            });
                            setShowModalEditMedecin(true);
                          }}>
                          <p>Edit</p>
                        </Button>
                        <Button variant="danger" size="sm"
                          onClick={() => {
                            handleDeleteMedecin(med.id);
                          }}>
                          <p>Delete</p>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            )}
          </Card>
        </Col>

        {/* Bloc Spécialités */}
        <Col md={3}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>Gestion des Spécialités</strong>
              <DropdownButton title="Options" size="sm" variant="primary">
                <Dropdown.Item onClick={() => setShowModalSpecialite(true)}>
                  Ajouter une spécialité
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowSpecialites(!showSpecialites)}>
                  {showSpecialites ? "Masquer la liste" : "Afficher la liste"}
                </Dropdown.Item>
              </DropdownButton>
            </Card.Header>
            {showSpecialites && (
              <Card.Body>
                <ul className='list-group'>
                  {specialites.map((spec, i) => (
                    <li key={i} className='list-group-item'>
                      {spec.nom}
                      <div>
                        <Button variant="warning" size="sm" className="me-2"
                          onClick={() => {
                            setSelectedSpecialite(spec.nom);
                            setShowModalEditSpecialite(true);
                          }}>
                          <p>Edit</p>
                        </Button>
                        <Button variant="danger" size="sm"
                          onClick={() => handleDeleteSpecialite(spec.nom)}>
                          <p>Delete</p>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            )
            }
          </Card>
        </Col>

        {/* Bloc Utilisateurs */}
        <Col md={3}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>Gestion des Patients</strong>
              <DropdownButton title="Options" size="sm" variant="info">
                <Dropdown.Item
                  onClick={() => {
                    setRoleToCreate("PATIENT");
                    setShowModal(true);
                  }}
                >
                  Créer un utilisateur
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowPatients(!showPatients)}>
                  {showPatients ? "Masquer la liste" : "Afficher la liste"}
                </Dropdown.Item>
              </DropdownButton>
            </Card.Header>
            {showPatients && (
              <Card.Body>
                <ul className="list-group">
                  {patients.map((user, i) => (
                    <li key={i} className="list-group-item">
                      {user.prenom} {user.nom} - {user.email}
                      <div>
                        <Button variant="warning" size="sm" className="me-2"
                          onClick={() => {
                            setRoleToUpdate("PATIENT");
                            setFormData({
                              id: user.id,
                              prenom: user.prenom,
                              nom: user.nom,
                              email: user.email,
                              password: ''
                            });
                            setShowEditModal(true);
                          }}                        
                        >
                          <p>Edit</p>
                        </Button>
                        <Button variant="danger" size="sm"
                          onClick={() => {
                            setRoleToDelete("PATIENT");
                            handleDelete(user.id);
                          }}
                        >
                          <p>Delete</p>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>

      {/* Modale de création */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Créer un {roleToCreate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={true}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Créer
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modale d’édition */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier {roleToUpdate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => 
            handleCancelEdit()
            }>
            Annuler
          </Button>
          <Button variant="success" onClick={handleUpdate}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modale pour ajouter une spécialité */}
      <Modal
        show={showModalSpecialite}
        onHide={() => setShowModalSpecialite(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une Spécialité</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nom de la Spécialité</Form.Label>
              <Form.Control
                type="text"
                value={selectedSpecialite}
                onChange={(e) => setSelectedSpecialite(e.target.value)}
                required={true}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalSpecialite(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAddSpecialite}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modale pour éditer une spécialité */}
      <Modal
        show={showModalEditSpecialite}
        onHide={handleCancelEditSpecialite}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier la Spécialité</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nom de la Spécialité</Form.Label>
              <Form.Control
                type="text"
                value={selectedSpecialite}
                onChange={(e) => setSelectedSpecialite(e.target.value)}
                required={true}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEditSpecialite}>
            Annuler
          </Button>
          <Button variant="success" onClick={handleEditSpecialite}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modale pour créer un médecin */}
      <Modal
        show={showModalMedecin}
        onHide={() => setShowModalMedecin(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Créer un Médecin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                value={medecinData.prenom}
                onChange={(e) =>
                  setMedecinData({ ...medecinData, prenom: e.target.value })
                }
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={medecinData.nom}
                onChange={(e) =>
                  setMedecinData({ ...medecinData, nom: e.target.value })
                }
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={medecinData.email}
                onChange={(e) =>
                  setMedecinData({ ...medecinData, email: e.target.value })
                }
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={medecinData.password}
                onChange={(e) =>
                  setMedecinData({ ...medecinData, password: e.target.value })
                }
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Spécialité</Form.Label>
              <Form.Select
                value={medecinData.specialite_id}
                onChange={(e) =>
                  setMedecinData({ ...medecinData, specialite_id: e.target.value })
                }
              >
                {specialites.map((spec, i) => (
                  <option key={i} value={spec.id}>{spec.nom}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Localisation</Form.Label>
              <Form.Control
                type="text"
                value={medecinData.location}
                onChange={(e) =>
                  setMedecinData({ ...medecinData, location: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalMedecin(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleCreateMedecin}>
            Créer
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modale pour éditer un médecin */}
      <Modal
        show={showModalEditMedecin}
        onHide={handleCancelEditMedecin}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier le Médecin</Modal.Title>
        </Modal.Header> 
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                value={medecinData.prenom}
                onChange={(e) =>
                  setMedecinData({ ...medecinData, prenom: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={medecinData.nom}
                onChange={(e) =>
                  setMedecinData({ ...medecinData, nom: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={medecinData.email}
                onChange={(e) =>
                  setMedecinData({ ...medecinData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) =>
                  setMedecinData({ ...medecinData, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Spécialité</Form.Label>
              <Form.Select
                value={medecinData.specialite_id}
                onChange={(e) =>
                  setMedecinData({ ...medecinData, specialite_id: e.target.value })
                }
              >
                {specialites.map((spec, i) => (
                  <option key={i} value={spec.id}>{spec.nom}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Localisation</Form.Label>
              <Form.Control
                type="text"
                value={medecinData.location}
                onChange={(e) =>
                  setMedecinData({ ...medecinData, location: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEditMedecin}>
            Annuler
          </Button>
          <Button variant="success" onClick={handleUpdateMedecin}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
