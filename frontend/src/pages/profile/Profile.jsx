import axios from "axios";
import { useEffect, useState } from "react";
// import Payment from "../payment/payment";
// import SlideCard from "../elements/Slide_Card";
import HeightInput from "../../components/HeightInput";
import { authStore } from "../../stores/auth_store/Store";
import Container from '@mui/material/Container';
import { Box } from "@mui/material";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function Profile() {
    const { user } = authStore((state) => state.user);
    const { token } = authStore((state) => state);
    const [isPending, setIsPending] = useState(false);
    const [isFormModified, setIsFormModified] = useState(false); // State to track form modifications

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [size, setSize] = useState();
    const [birthDate, setBirthDate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // const handleSuccessfulPayment = () => {
    //     Axios.put(
    //         "http://127.0.0.1:8000/api/update-user/",
    //         {
    //             registration: true,
    //             PUT_TYPE: "Payment",
    //             PAYMENT_TYPE: "Card",
    //         },
    //         {
    //             headers: {
    //                 Authorization: `Token ${Cookies.get("access_token")}`,
    //             },
    //         }
    //     ).then(() => {
    //         setTimeout(() => location.reload(), 2000);
    //     });
    // };

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
            "http://127.0.0.1:8000/api/update-user/",
            {
                PUT_TYPE: "Update",
                first_name: firstName,
                last_name: lastName,
                username: username, // Include username in the request body
                email: email,
                phone_number: phoneNumber,
                height: heightInInches,
                weight: weight,
                age: birthDate, // Include birthDate in the request body
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
            window.location.reload();
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
            setBirthDate(user?.profile.age);
            setPhoneNumber(user?.profile.phone_number);
        }
    }, [user])

    return (
        <Container>
            My profile <br />
            <Box>{username}</Box>
            {/* <FormControl fullWidth > */}
                <Box>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(event) => { setFirstName(event.target.value); handleFormChange(); }}
                    />
                </Box>
                <Box>
                    <label>Last name:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(event) => { setLastName(event.target.value); handleFormChange(); }}
                    />
                </Box>
                <Box>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => { setEmail(event.target.value); handleFormChange(); }}
                    />
                </Box>
                <Box>
                    <label>Phone number:</label>
                    <input
                        type="number"
                        value={phoneNumber}
                        onChange={(event) => { setPhoneNumber(event.target.value); handleFormChange(); }}
                    />
                </Box>
                <Box>
                    <label>Height:</label>
                    <HeightInput
                        value={height}
                        setValue={(value) => {
                            setHeight(value);
                            handleFormChange();
                        }}
                    />
                </Box>
                <Box>
                    <label>Weight:</label>
                    <input
                        type="number"
                        placeholder="Enter Here"
                        value={weight}
                        onChange={(event) => { setWeight(event.target.value); handleFormChange(); }}
                    />
                </Box>
                <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth >

                    <InputLabel id="demo-simple-select-label">Shirt Size:</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Shirt Size"
                        SelectDisplayProps={size}
                        value={size}
                        onChange={(event) => { setSize(event.target.value); handleFormChange(); }}
                    >
                        <MenuItem value="SMALL">Small</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="LARGE">Large</MenuItem>
                        <MenuItem value="EXTRA-LARGE">Extra-Large</MenuItem>
                        <MenuItem value="2XL">2XL</MenuItem>
                        <MenuItem value="3XL">3XL</MenuItem>
                    </Select>
                    </FormControl>
                </Box>
                <Box>
                    <Button onClick={handleSubmit} disabled={!isFormModified || isPending}>
                        Save Changes
                    </Button>
                </Box>
            {/* </FormControl> */}
            {/* {user.profile.registration === false ? ( */}
            {/* //   <div className="registration">
        //     <div className="pr-form">
        //       <div className="pr-header">Register for new season</div>
        //       <div className="pr-body">
        //         <SlideCard title={"Pay With Card"}>
        //           <Payment handleSuccessfulPayment={handleSuccessfulPayment} />
        //         </SlideCard>
        //       </div>
        //     </div>
        //   </div>
        // ) : null} */}
        </Container>
    );
}