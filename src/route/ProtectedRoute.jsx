import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Loader from '@components/layout/loader'; // Assuming you have a loader component
import { getCurrentUser } from '../utils/helpers';

const ProtectedRoute = ({ children, isAdmin = false, isFarmer = false }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = getCurrentUser(); 
    const register = localStorage.getItem('register');

    useEffect(() => {

        if (!user) {
            setLoading(false); 
        }
    }, [user]);

    if (loading) {
        return <Loader />; 
    }

    if (!user) {
        return <Navigate to='/login' />;
    }

    if (isAdmin && user.role !== 'admin') {
        return <Navigate to='/' />;
    }
    if (isFarmer && user.role !== 'farmer') {
        return <Navigate to='/' />;
    }

    

    return children;
};

export default ProtectedRoute;