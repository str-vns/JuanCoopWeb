import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Loader from '../components/layout/loader'; 
import { getCurrentUser } from '@utils/helpers';

const RoleBaseRoute = () => {
    const [loading, setLoading] = useState(true); 
    const [user, setUser] = useState(null); 
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to fetch user data');
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error}</div>; 
    }

    if (user) {
        if (user.roles.includes('Admin')) {
            return <Navigate to="/dashboard" />;
        } else if (user.roles.includes('Customer') && user.roles.includes('Cooperative')) {
            return <Navigate to="/coopdashboard" />;
        } else {
            return <Navigate to="/home" />;
        }
    }

    return <Navigate to="/home" />;
};

export default RoleBaseRoute;