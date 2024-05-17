import { useState, useEffect } from 'react';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { login } from '../../services/UserApiRequest';
import { toast } from 'react-hot-toast';
import { authStore } from '../../stores/auth_store/Store';
import { useNavigate } from 'react-router-dom';
import { Container, Box, FormControl, Typography, Stack, Input, Button, InputLabel, IconButton, InputAdornment, Link } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Person3Icon from '@mui/icons-material/Person3';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setToken = authStore(store => store.setToken)

    const navigate = useNavigate();
    const { token } = authStore((state) => state);

    const handleLogin = () => {
        login(username, password)
            .then((token) => {
                setToken(token)
                toast.success("Successfully Logged in!")
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
            navigate("/dashboard", { replace: true });
        }
    }, [token, navigate]);

    return (
        <Container >
            <Box
                my={4}
                display="flex"
                flexDirection='column'
                alignItems="center"
                textAlign='center'
                gap={4}
                p={2}
            >
                <SportsGymnasticsIcon fontSize='large'/>
                <Stack spacing={1} sx={{ display: 'flex', alignItems: 'start' }}>
                    <Typography variant="h4">Login</Typography>
                </Stack>
                <FormControl variant="standard">
                    <InputLabel>Username</InputLabel>
                    <Input
                        placeholder="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton>
                                    <Person3Icon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <FormControl variant="standard">
                    <InputLabel>Password</InputLabel>
                    <Input
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <Typography><Link href="https://wa.me/6361159300?text=Hi,%20I%20forgot%20my%20password%20for%20KOS,%20can%20you%20create%20a%20new%20one%20for%20me?" variant="body2">Forgot password?</Link></Typography>
                <FormControl variant="standard">
                    <Button onClick={handleLogin} color='secondary' variant='contained'>
                        Login
                    </Button>
                </FormControl>
                <Typography variant="overline">Not have an account yet? <Link href="/signup">signup</Link></Typography>
            </Box>
        </Container>
    );
}
