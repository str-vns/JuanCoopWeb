import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Loader from '@components/layout/loader'; // Assuming you have a loader component
import { getCurrentUser } from '@utils/helpers';

const RoleBaseRoute = () => {
    const [loading, setLoading] = useState(getCurrentUser() === false && false )
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [user, setUser] = useState(getCurrentUser())
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    console.log("User", user)
    if (loading === false) {
        // if (!user) {
        //     return <Navigate to='/login' />
        // }
        if ( user.roles === 'Admin') {
            return <Navigate to='/' />  
        } else if (user.roles.includes('Customer') && user.roles.includes('Cooperative')) 
            {
            return <Navigate to='/coopdashboard' />;
        } else {
            return <Navigate to="/home" />;
        }

       
    }
    return <Loader />;
};

export default RoleBaseRoute;