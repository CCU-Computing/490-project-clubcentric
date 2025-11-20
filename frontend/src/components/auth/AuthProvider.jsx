import { useState } from 'react';
import AuthContext from './AuthContext';
import { login_user } from '../../services/userService';

export default function AuthProvider({ children })
{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    async function login(username, password)
    {
        const response = await login_user(username, password);

        if (response && response.status === true)
        {
            setIsAuthenticated(true);
            setUser(response.user);
            return true;
        }

        setIsAuthenticated(false);
        return false;
    }

    function logout()
    {
        setIsAuthenticated(false);
        setUser(null);
    }

    const value = {
        isAuthenticated,
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
