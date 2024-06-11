import axios from "axios";
import { useEffect, useState } from "react";
import HeightInput from "../../components/HeightInput";
import { authStore } from "../../stores/auth_store/Store";
import { Container, Box, Button, FormControl, NativeSelect, Typography, Input, InputLabel, Stack } from "@mui/material";
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
    const { user } = authStore((state) => state.user);
    const { token } = authStore((state) => state);
    const [isPending, setIsPending] = useState(false);
    const [isFormModified, setIsFormModified] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [size, setSize] = useState();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [registration, setRegistration] = useState('');

    const handleFormChange = () => {
        setIsFormModified(true);
    };

    // FUNCTION FOR THE USER TO UPDATE USER'S PROFILE INFO
    const handleSubmit = async () => {
        const splittedHeight = height.split("'");
        let heightInInches = Number(splittedHeight[0]) * 12;
        heightInInches += !splittedHeight ? 0 : Number(splittedHeight[1]);

        setIsPending(true);
        await axios.put(
            `${API_URL}/authentication/user/`,
            {
                PUT_TYPE: "Update",
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone_number: phoneNumber,
                height: heightInInches,
                weight: weight,
                shirt_size: size,
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        ).then(() => {
            // After successful update, reset form modification state
            setIsFormModified(false);
            setIsPending(false);
            toast.success("Changes saved! ✅")
        }).catch(error => {
            console.error('Error updating user:', error);
            setIsPending(false);
        });
    };

    // FUNCTION THAT SETS THE CURRENT USER'S INFO
    useEffect(() => {
        if (user) {
            // USER MODEL INFO
            setFirstName(user?.first_name);
            setLastName(user?.last_name);
            setUsername(user?.username);
            setEmail(user?.email);
            // EXTENDED MODEL PROFILE INFO
            setHeight(user?.profile.formatted_height);
            setWeight(user?.profile.weight);
            setSize(user?.profile.shirt_size);
            setPhoneNumber(user?.profile.phone_number);
            setRegistration(user?.profile.registration);
        }
    }, [user])

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
                        <Typography variant="h4">My profile</Typography>
                        <Typography variant="h5" color={'#D65DB1'}>{username}</Typography>
                        <Typography variant="h5">Registration status:</Typography>
                        <Typography variant="h5" color={'#D65DB1'}>{registration ? "Paid" : "Unpaid"}</Typography>
                    </Stack>
                    <FormControl variant="standard">
                        <InputLabel>Name:</InputLabel>
                        <Input
                            type="text"
                            value={firstName}
                            onChange={(event) => { setFirstName(event.target.value); handleFormChange(); }}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Last name:</InputLabel>
                        <Input
                            type="text"
                            value={lastName}
                            onChange={(event) => { setLastName(event.target.value); handleFormChange(); }}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Email</InputLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(event) => { setEmail(event.target.value); handleFormChange(); }}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Phone number:</InputLabel>
                        <Input
                            type="tel"
                            value={phoneNumber}
                            onChange={(event) => { setPhoneNumber(event.target.value); handleFormChange(); }}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Height:</InputLabel>
                        <HeightInput
                            value={height}
                            setValue={(value) => {
                                setHeight(value);
                                handleFormChange();
                            }}
                        />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel>Weight:</InputLabel>
                        <Input
                            type="number"
                            placeholder="Enter Here"
                            value={weight}
                            onChange={(event) => { setWeight(event.target.value); handleFormChange(); }}
                        />
                    </FormControl>
                    <FormControl variant="standard" >
                        <InputLabel>Shirt Size:</InputLabel>
                        <NativeSelect
                            value={size}
                            onChange={(event) => { setSize(event.target.value); handleFormChange(); }}
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
                        <Button onClick={handleSubmit} disabled={!isFormModified || isPending} sx={{ alignSelf: 'center' }} variant="contained" size="medium" color="secondary">
                            Save Changes
                        </Button>
                    </FormControl>
                </Stack>
            </Box>
        </Container>
    );
}