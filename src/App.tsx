
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Index';
import About from './pages/Faq';
import Contact from './pages/Contact';
import Blog from './pages/NotFound'; // Placeholder for Blog
import Destinations from './pages/Destination';
import Packages from './pages/Packages';
import Login from './pages/authentication/Login';
import Register from './pages/Signup';
import TravelAgencyDashboard from './pages/TravelAgencyDashboard';
import PackageCreation from './pages/PackageCreation';
import CustomTripBuilder from './pages/CustomTripBuilder';
import AgencyPackages from './pages/Packages'; // Using existing Packages as placeholder
import PackageEdit from './pages/PackageCreation'; // Using PackageCreation as a placeholder for edit
import ProtectedRoute from './components/guards/RouteGuard';

// Import the new PackageDetail page
import PackageDetail from './pages/PackageDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/agency-dashboard" element={
          <ProtectedRoute>
            <TravelAgencyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/package-creation" element={
          <ProtectedRoute>
            <PackageCreation />
          </ProtectedRoute>
        } />
        <Route path="/custom-trip-builder" element={
          <ProtectedRoute>
            <CustomTripBuilder />
          </ProtectedRoute>
        } />
        <Route path="/agency-packages" element={
          <ProtectedRoute>
            <AgencyPackages />
          </ProtectedRoute>
        } />
         <Route path="/package-edit/:id" element={
          <ProtectedRoute>
            <PackageEdit />
          </ProtectedRoute>
        } />
        
        {/* Add the new package detail route */}
        <Route path="/packages/:id" element={<PackageDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
