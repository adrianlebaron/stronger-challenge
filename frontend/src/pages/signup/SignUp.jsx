import axios from "axios";
import { useEffect, useState } from "react";
import HeightInput from "../../components/HeightInput";
import { Container, Box, Button, FormControl, NativeSelect, Typography, Input, InputLabel, Stack } from "@mui/material";
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
    const [username, setUsername] = useState(false);
    const [email, setEmail] = useState(false);
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState();
    const [shirtSize, setSize] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // FUNCTION FOR THE USER TO UPDATE USER'S PROFILE INFO
    const handleSubmit = () => {
        const splittedHeight = height.split("'");
        let heightInInches = Number(splittedHeight[0]) * 12;
        heightInInches += !splittedHeight ? 0 : Number(splittedHeight[1]);
        
        axios.post(
            `${API_URL}/authentication/signup/`,
            {
                username: username,
                email: email,
                password: password,
                first_name: firstname,
                last_name: lastname,
                age: age,
                height: heightInInches,
                weight: weight,
                shirt_size: shirtSize,
                phone_number: phoneNumber,
            }
        ).then(() => {
            toast.success("Created account successfully!")
        }).catch(error => {
            console.error('Error:', error);
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
                    <FormControl variant="standard">
                        <InputLabel>Name:</InputLabel>
                        <Input
                            type="text"
                            onChange={(event) => { setFirstname(event.target.value);}}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Last name:</InputLabel>
                        <Input
                            type="text"
                            onChange={(event) => { setLastname(event.target.value)}}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Username:</InputLabel>
                        <Input
                            type="text"
                            onChange={(event) => { setUsername(event.target.value)}}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Password:</InputLabel>
                        <Input
                            type="password"
                            onChange={(event) => { setPassword(event.target.value)}}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Email</InputLabel>
                        <Input
                            type="email"
                            onChange={(event) => { setEmail(event.target.value);}}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Phone number:</InputLabel>
                        <Input
                            type="tel"
                            onChange={(event) => { setPhoneNumber(event.target.value);}}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Age:</InputLabel>
                        <Input
                            type="number"
                            onChange={(event) => { setAge(event.target.value);}}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Height:</InputLabel>
                        <HeightInput
                            setValue={(value) => {setHeight(value);}}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Weight:</InputLabel>
                        <Input
                            type="number"
                            placeholder="Enter Here"
                            onChange={(event) => { setWeight(event.target.value);}}
                        />
                    </FormControl>
                    <FormControl variant="standard" >
                        <InputLabel>Shirt Size:</InputLabel>
                        <NativeSelect
                            onChange={(event) => { setSize(event.target.value);}}
                        >
                            <option value="SMALL">Small</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LARGE">Large</option>
                            <option value="EXTRA-LARGE">Extra-Large</option>
                            <option value="2XL">2XL</option>
                            <option value="3XL">3XL</option>
                        </NativeSelect>
                    </FormControl>
                    <FormControl variant="standard">
                        <Button onClick={handleSubmit} sx={{ alignSelf: 'center' }} variant="contained" size="medium" color="secondary">
                            Sign up
                        </Button>
                    </FormControl>
                </Stack>
            </Box>
        </Container>
    );
}