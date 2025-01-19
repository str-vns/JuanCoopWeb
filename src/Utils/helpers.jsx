
export const authenticated = (data, next) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(data.accessToken)); 
        localStorage.setItem('user', JSON.stringify({ 
            _id: data.user._id,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            gender: data.user.gender,
            roles: data.user.roles,
            wishlist: data.user.wishlist,
            tag: data.user.tag
        }));

        const currentDate = new Date();
currentDate.setDate(currentDate.getDate() + 7);
currentDate.setHours(7, 0, 0, 0); 


const expirationDate = currentDate;
        localStorage.setItem('token_expiry', expirationDate);
        localStorage.setItem('isAuth', true); 
    }
    next();
};

export const getToken = () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('jwt');
            return token ? JSON.parse(token) : false; 
        }
        return false;
};

export const getCurrentUser = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : false; 
    }
    return false;
};

export const isAuth = () => {
    if (typeof window !== 'undefined') {
        const isAuthenticated = localStorage.getItem('isAuth');
        return isAuthenticated ? JSON.parse(isAuthenticated) : false; 
    }
    return false;
};

export const logoutCurrentUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuth');
        localStorage.removeItem('token_expiry');
        localStorage.removeItem('cartItems');
    }

};

export const getTokenExpireTime = () => {
    if (typeof window !== 'undefined') {
        const expirationDate = localStorage.getItem('token_expiry');
        return expirationDate ? new Date(expirationDate) : false;
    }
    return false;
}