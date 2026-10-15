import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/custom-bootstrap-overrides.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chabot from './components/Chatbot';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profil from './pages/user/Profil'; 
import Rdv from './pages/user/Rdv';
import HistoriqueRdvPatient from './pages/user/HistoriqueRdv';
import Dossier from './pages/user/Dossier';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Dossiers from './pages/medecin/DossiersMedecin';
import Rdvs from './pages/medecin/Rdvs';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Forbidden from './pages/Forbidden';
import Messagerie from './pages/Messagerie';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pages/user/profil" element={
            <ProtectedRoute requiredRoles={['PATIENT', 'MEDECIN', 'ADMIN']}>
              <Profil />
            </ProtectedRoute>
          } />
          <Route path="/pages/user/rdv" element={
            <ProtectedRoute requiredRoles={['PATIENT']}>
              <Rdv />
            </ProtectedRoute> 
          } />
          <Route path="/pages/user/historique" element={
            <ProtectedRoute requiredRoles={['PATIENT']}>
              <HistoriqueRdvPatient />
            </ProtectedRoute>
          } />
          <Route path="/pages/user/dossier" element={
            <ProtectedRoute requiredRoles={['PATIENT']}>
              <Dossier />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/medecin/dossiers" element={
            <ProtectedRoute requiredRoles={['MEDECIN']}>
              <Dossiers />
            </ProtectedRoute>
          } />
          <Route path="/medecin/dossiers/:dossierId" element={
            <ProtectedRoute requiredRoles={['MEDECIN']}>
              <Dossiers />
            </ProtectedRoute>
          } />
          <Route path="/medecin/rdvs" element={
            <ProtectedRoute requiredRoles={['MEDECIN']}>
              <Rdvs />
            </ProtectedRoute>
          } />
          <Route path="/pages/messagerie" element={
            <ProtectedRoute requiredRoles={['PATIENT', 'MEDECIN']}>
              <Messagerie />
            </ProtectedRoute>
          }/>
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Chabot />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
