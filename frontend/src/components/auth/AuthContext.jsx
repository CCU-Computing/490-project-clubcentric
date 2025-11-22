import { createContext, useState, useEffect } from 'react';
import { login_user, logout_user, get_user } from '../../services/userService';

const AuthContext = createContext();

export function AuthProvider({ children })
{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const userData = await get_user();
                if (userData && userData.id) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                // 401 or any error means not authenticated
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

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
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
