import { Container } from "@mui/material"
import { authStore } from "../../stores/auth_store/Store"

export default function Profile() {
    const { user } = authStore((state) => state.user);

    return (
        <Container>
            <div>Username: {user?.username}</div>
            Email
            First Name
            Last Name
            Height
            Weight
            Date of birth
            Shirt Size
            Phone Number
        </Container>
    );
}
