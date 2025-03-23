import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import BrowseVehicle from './pages/browse/BrowseVehicle';
import './App.css';
import './pages/login/login.scss';
import './pages/register/register.scss';

function App() {

  
  console.log("API URL:", import.meta.env.VITE_API_URL);
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse" element={<BrowseVehicle />} />
  
          <Route path="*" element={<Navigate to="/" replace />} /> 
          {/* redirects the user to the home page if they try to access a page that doesn't exist */}
          {/* replace prop is used to replace the current entry in the history stack instead of adding a new one */}
          {/* this way the user can't navigate back to the previous page by hitting the back button */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;