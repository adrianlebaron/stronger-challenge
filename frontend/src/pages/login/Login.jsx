import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/login/`, {
                username,
                password,
            });
            const token = response.data.token;
            // Store token in cookies
            Cookies.set('access_token', token);
            // Redirect user to home page
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            // Handle login failure, show error message or toast
        }
    };

    return (
        <div>
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
        </div>
    );
}
