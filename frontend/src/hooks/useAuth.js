import { useContext } from 'react';
import { AuthProvider } from '../components/auth/AuthContext';

export const useAuth = () => useContext(AuthProvider);
