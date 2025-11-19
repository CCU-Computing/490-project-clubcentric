import { useAuth } from '../hooks/useAuth';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LoginPage()
{
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () =>
    {
        login();  // sets isAuthenticated = true
        navigate('/home');
    };

    return (
        <div>
            <h2>Login</h2>
            <Button variant="contained" onClick={handleLogin}>
                Sign In
            </Button>
        </div>
    );
}
