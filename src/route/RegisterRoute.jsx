import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Loader from '@components/layout/loader'; 

const RegisterRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [register, setRegister] = useState(null);

    useEffect(() => {
        const userRegisterStatus = localStorage.getItem('UserRegister');
        setRegister(userRegisterStatus);
        setLoading(false); 
    }, []);

    if (loading) {
        return <Loader />;
    }
    if (!register) {
        return <Navigate to="/Register" />;
    }

    return children;
};

export default RegisterRoute;