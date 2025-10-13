import { useAuth } from '../hooks/useAuth';
import { Button } from '@mui/material';

export default function LoginPage()
{
    const { login } = useAuth();

    const handleLogin = () =>
    {
        login();  // sets isAuthenticated = true
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
