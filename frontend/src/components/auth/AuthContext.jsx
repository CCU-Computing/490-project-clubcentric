import { createContext, useState } from 'react';
import { login_user, logout_user } from '../../services/userService';

const AuthContext = createContext();

export function AuthProvider({ children })
{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const login = async (username, password) => 
    {
        const result = await login_user(username, password);

        if (result && result.status == true)
        {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = async() =>
    {
        await logout_user();
        setIsAuthenticated(false);
    };

    return(
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
