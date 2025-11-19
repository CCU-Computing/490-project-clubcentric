import { useContext } from 'react';
import AuthContext from '../components/auth/AuthContext';

export const useAuth = () => 
{
    return useContext(AuthContext);
};