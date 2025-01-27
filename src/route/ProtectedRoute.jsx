import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Loader from '../components/layout/loader'; // Assuming you have a loader component
import { getCurrentUser } from '@utils/helpers';

const ProtectedRoute = ({ children, isAdmin = false, isCooperative = false, isCustomer = true }) => {
    const [loading, setLoading] = useState(getCurrentUser() === false && false )
    const [error, setError] = useState('')
    const [user, setUser] = useState(getCurrentUser())
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    
    if (loading === false) {
        if (!user) {
            return <Navigate to='/login' />
        }
        if (isAdmin === true && user.roles !== 'Admin') {
            return <Navigate to='/home' />
        }
        if (isCooperative === true && !user.roles.includes('Cooperative') && !user.roles.includes('Customer')) 
            {
            return <Navigate to='/home' />;
        }
        if (isCustomer === true && !user.roles.includes('Customer')) 
            {
            return <Navigate to='/home' />;
        }
        return children
    }
    return <Loader />;
};

export default ProtectedRoute;