import { Container } from "@mui/material"
import { authStore } from "../../stores/auth_store/Store"

export default function Profile() {
    const { user } = authStore((state) => state);

    console.log('USER', user)
    // Once data is loaded, render the user information
    return (
        <Container>
            {user && (
                <>
                    <div>Username: {user?.user.username}</div>
                    <div>First Name: {user?.user.first_name}</div>
                    <div>Last Name: {user?.user.last_name}</div>
                    <div>Email: {user?.user.email}</div>
                    <div>Date Joined: {user?.user.date_joined}</div>
                </>
            )}
        </Container>
    );
    
}
