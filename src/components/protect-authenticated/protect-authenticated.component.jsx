// ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../lib/auth';

const ProtectAuthenticated = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectAuthenticated;