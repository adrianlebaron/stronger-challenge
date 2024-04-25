// import Axios from "axios";
import { useEffect, useState } from "react";
// import Payment from "../payment/payment";
// import SlideCard from "../elements/Slide_Card";
import HeightInput from "../../components/HeightInput";
import { authStore } from "../../stores/auth_store/Store";
import Container from '@mui/material/Container';

export default function Profile() {
    const { user } = authStore((state) => state.user);
    // const { token } = authStore((state) => state);
    // const {username, setUsername} = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [size, setSize] = useState();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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

    // const handleSubmit = () => {
    //     const splittedHeight = height.split("'");
    //     let heightInInches = Number(splittedHeight[0]) * 12;
    //     heightInInches += !splittedHeight ? 0 : Number(splittedHeight[1]);

    //     Axios.put(
    //         "http://127.0.0.1:8000/api/update-user/",
    //         {
    //             PUT_TYPE: "Update",
    //             height: heightInInches,
    //             weight: weight,
    //             shirt_size: size ? size : user.profile.shirt_size,
    //         },
    //         {
    //             headers: {
    //                 Authorization: `Token ${token}`,
    //             },
    //         }
    //     ).then((res) => {
    //         window.location.reload();
    //     });
    // };

    useEffect(() => {
        if (user) {
            // setUsername(user?.username);
            setEmail(user?.email);
            setFirstName(user?.first_name);
            setLastName(user?.last_name);
            setHeight(user?.profile.formatted_height);
            setWeight(user?.profile.weight);
            setSize(user?.profile.shirt_size);
            setBirthDate(user?.profile.age);
            setPhoneNumber(user?.profile.phone_number);
        }
    }, [user])

    return (
        <Container>
                Profile <br />
            <label htmlFor="">Height:</label>
            <HeightInput value={height} setValue={setHeight}/>
            <b><label htmlFor="">Weight:</label></b>
            <input
                type="text"
                placeholder="Enter Here"
                value={weight}
            onChange={(event) => setWeight(event.target.value)}
            />
            <b><label htmlFor="">Shirt Size:</label></b>
            {/* <select
                className="profile-input"
                onChange={(event) => setSize(event.target.value)}
            >
                <option
                    value="SMALL"
                    selected={
                        size === "SMALL"
                    }
                >
                    Small
                </option>
                <option
                    value="MEDIUM"
                    selected={
                        size === "MEDIUM"
                    }
                >
                    Medium
                </option>
                <option
                    value="LARGE"
                    selected={
                        size === "LARGE"
                    }
                >
                    Large
                </option>
                <option
                    value="EXTRA-LARGE"
                    selected={
                        size === "EXTRA-LARGE"
                    }
                >
                    Extra-Large
                </option>
                <option
                    value="2XL"
                    selected={
                        size === "2XL"
                    }
                >
                    2XL
                </option>
                <option
                    value="3XL"
                    selected={
                        size === "3XL"
                    }
                >
                    3XL
                </option>
            </select> */}
            <div>
                <button >
                    Save Changes
                </button>
            </div>
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