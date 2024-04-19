import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { login } from '../../services/UserApiRequest';
import { toast } from 'react-hot-toast';
import { authStore } from '../../stores/auth_store/Store';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setToken = authStore(store=>store.setToken)

    const navigate = useNavigate();
    const {token} = authStore((state) => state);

    const handleLogin = () => {
        login(username, password)
            .then((token) => {
                setToken(token)
                toast.success("Successfully Logged in!🥵")
            })
            .catch(() => {
                toast.error("Login failed. Please try again.");
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (token) {
          navigate("/", { replace: true });
        }
      }, [token, navigate]);

    return (
        <Box style={{paddingTop: '50px'}}>
            <h1>Login</h1>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <div>
                    <input
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={togglePasswordVisibility}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>
            <button onClick={handleLogin}>Login</button>
        </Box>
    );
}
