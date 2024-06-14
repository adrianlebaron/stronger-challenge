import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Button, FormControl, Select, MenuItem, Typography, Input, InputLabel, Stack, InputAdornment, IconButton, Link } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-hot-toast';
import { authStore } from '../../stores/auth_store/Store';

const API_URL = import.meta.env.VITE_API_URL;

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [shirtSize, setSize] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const setToken = authStore(store => store.setToken);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const authenticateUser = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/authentication/user/login/`, {
                username: username,
                password: password,
            });
            setToken(response.data.token);
            navigate('/profile', { replace: true });
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to authenticate');
        }
    };

    const handleSubmit = () => {
        axios.post(
            `${API_URL}/authentication/signup/`,
            {
                username: username,
                email: email,
                password: password,
                first_name: firstname,
                last_name: lastname,
                age: age,
                weight: weight,
                shirt_size: shirtSize,
                phone_number: phoneNumber,
            }

        ).then(() => {
            toast.success("Created account successfully, welcome to the challenge!", {
                duration: 10000,
            });
            authenticateUser(username, password);
        }).catch(error => {
            console.error('Error:', error);
            if (error.response && error.response.status === 409) {
                toast.error('Username already exists');
            } else {
                toast.error('Something went wrong');
            }
        });
    };

    return (
        <Container>
            <Box
                my={4}
                display="flex"
                flexDirection='column'
                alignItems="center"
                textAlign='center'
                gap={4}
                p={2}
            >
                <Stack spacing={2} width={'90%'}>
                    <Stack spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h4">Create an account</Typography>
                    </Stack>
                    <Typography variant="overline">Already have an account? <Link href="/login">Login</Link></Typography>
                    <FormControl variant="standard">
                        <InputLabel>Name:</InputLabel>
                        <Input
                            type="text"
                            onChange={(event) => { setFirstname(event.target.value); }}
                            required
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Last name:</InputLabel>
                        <Input
                            type="text"
                            onChange={(event) => { setLastname(event.target.value); }}
                            required
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Username:</InputLabel>
                        <Input
                            type="text"
                            onChange={(event) => { setUsername(event.target.value); }}
                            required
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Password:</InputLabel>
                        <Input
                            placeholder="Password"
                            type={showPassword ? 'text' : 'password'}
                            onChange={(event) => setPassword(event.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            required
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Email</InputLabel>
                        <Input
                            type="email"
                            onChange={(event) => { setEmail(event.target.value); }}
                            required
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Phone number:</InputLabel>
                        <Input
                            type="tel"
                            onChange={(event) => { setPhoneNumber(event.target.value); }}
                            required
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Age:</InputLabel>
                        <Input
                            type="number"
                            onChange={(event) => { setAge(event.target.value); }}
                            required
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Weight:</InputLabel>
                        <Input
                            type="number"
                            placeholder="Enter Here"
                            onChange={(event) => { setWeight(event.target.value); }}
                            required
                        />
                    </FormControl>
                    <FormControl variant="standard" >
                        <InputLabel>Shirt Size:</InputLabel>
                        <Select
                            onChange={(event) => { setSize(event.target.value); }}
                            required
                        >
                            <MenuItem value="SMALL">Small</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="LARGE">Large</MenuItem>
                            <MenuItem value="EXTRA-LARGE">Extra-Large</MenuItem>
                            <MenuItem value="2XL">2XL</MenuItem>
                            <MenuItem value="3XL">3XL</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard">
                        <Button onClick={handleSubmit} sx={{ alignSelf: 'center' }} variant="contained" size="medium" color="secondary">
                            Sign up
                        </Button>
                    </FormControl>
                </Stack>
                <Typography variant="overline">You need to send a screenshot of your payment to KOS Challenge admin to mark you as paid once you create your account</Typography>
            </Box>
        </Container>
    );
}
