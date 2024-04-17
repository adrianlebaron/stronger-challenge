import { NavLink } from "react-router-dom";
import { authStore } from "../stores/auth_store/Store";

export default function Navbar() {
    const {setToken, setUser} = authStore(store=>store)
    const {token} = authStore((state) => state);

    const handleSignOut = () => {
        setToken(""),
        setUser("")
    };

    const loggedOutLinks = () => {
        return (
            <div>
                <NavLink
                    to="/"               
                >
                    Home
                </NavLink>
                <NavLink
                    to="/shop"
                >
                    Shop
                </NavLink>
                <NavLink
                    to="/signup"
                >
                    Signup
                </NavLink>
                <NavLink
                    to="/login"
                >
                    Login
                </NavLink>
            </div>
        );
    };

    const loggedInLinks = () => {
        return (
            <div>
                <NavLink
                    to="/"
                >
                    Home
                </NavLink>
                <NavLink
                    to="/shop"
                >
                    Shop
                </NavLink>
                <NavLink
                    to="/feed"
                >
                    Feed
                </NavLink>
                <NavLink
                    to="/score"
                >
                    Score
                </NavLink>
                <NavLink
                    to="/dashboard"
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/profile"
                >
                    Profile
                </NavLink>
                {/* {adminLinks()} */}
                <button
                    onClick={handleSignOut}
                >
                    Logout
                </button>
            </div>
        )
    }

    // const adminLinks = () => {
    //     if (user) {
    //         if (user.profile.roles === "ADMIN") {
    //             return (
    //                 <div>
    //                     <NavLink exact to="/admin">
    //                         Admin
    //                     </NavLink>
    //                 </div>
    //             );
    //         }
    //     }
    // };

    return (
        <div>
            {token ? loggedInLinks() : loggedOutLinks()}
        </div>
    )
}