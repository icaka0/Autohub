import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/login';
import Register from './pages/register/Register';
import BrowseVehicle from './pages/browse/BrowseVehicle';
import UserProfile from './pages/UserProfile/UserProfile';
import VehicleAd from './pages/vehicleAd/VehicleAd';
import MyVehicleAds from './pages/myVehicleAds/MyVehicleAds';
import CreateVehicleAd from './pages/createVehicleAd/CreateVehicleAd';
import EditVehicleAd from './pages/editVehicleAd/EditVehicleAd';
import AdminPanel from './pages/admin/AdminPanel';
import './App.css';
import './pages/login/login.scss';
import './pages/register/register.scss';
import { AuthProtectedRoute, OwnerProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoute';
import Favorites from './pages/favorites/Favorites';
import { Link } from 'react-router-dom';
import { getVehicleAd } from './services/api';

function App() {

  
  console.log("API URL:", import.meta.env.VITE_API_URL);
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse" element={<BrowseVehicle />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/vehicles/:id" element={<VehicleAd />} />
          <Route 
            path="/my-ads" 
            element={
              <AuthProtectedRoute>
                <MyVehicleAds />
              </AuthProtectedRoute>
            } 
          />
          <Route 
            path="/create-ad" 
            element={
              <AuthProtectedRoute>
                <CreateVehicleAd />
              </AuthProtectedRoute>
            } 
          />
          <Route 
            path="/edit-ad/:id" 
            element={
              <OwnerProtectedRoute>
                <EditVehicleAd />
              </OwnerProtectedRoute>
            } 
          />
          <Route path="/vehicle/:id" element={<VehicleAd />} />
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminPanel />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <AuthProtectedRoute>
                <Favorites />
              </AuthProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} /> 
          {/* redirects the user to the home page if they try to access a page that doesn't exist */}
          {/* replace prop is used to replace the current entry in the history stack instead of adding a new one */}
          {/* this way the user can't navigate back to the previous page by hitting the back button */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;