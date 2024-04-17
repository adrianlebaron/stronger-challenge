import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { login } from '../../services/UserApiRequest';
import { toast } from 'react-hot-toast';
import { authStore } from '../../store/Store';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setToken = authStore(store=>store.setToken)

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
