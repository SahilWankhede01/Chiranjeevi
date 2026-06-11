import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                {/* FIX 3: Skip to content link for keyboard navigation */}
                <a href="#main-content" className="skip-to-content">
                  Skip to main content
                </a>
                <Navbar />
                
                {/* Main Content Area */}
                {/* FIX 5: Main landmark with skip link target ID */}
                <main id="main-content" className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Patient protected dashboard */}
                    <Route
                      path="/patient-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['patient', 'doctor']}>
                          <PatientDashboard />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Doctor protected dashboard */}
                    <Route
                      path="/doctor-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['doctor']}>
                          <DoctorDashboard />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* fallback 404 */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </main>

                <Footer />
                <WhatsAppButton />
              </div>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
