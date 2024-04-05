import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";

export default function Navbar(props) {
    const { user } = useContext(UserContext)

    const handleSignOut = () => {
        Cookies.remove('access_token')
        window.location.reload()
    };

    const loggedOutLinks = () => {
        return (
            <div>
                <NavLink
                    to="/"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/shop"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }
                >
                    Shop
                </NavLink>
                <NavLink
                    to="/signup"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }
                >
                    Signup
                </NavLink>
                <NavLink
                    to="/login"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }
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
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/shop"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }
                >
                    Shop
                </NavLink>
                <NavLink
                    to="/feed"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }
                >
                    Feed
                </NavLink>
                <NavLink
                    to="/score"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }
                >
                    Score
                </NavLink>
                <NavLink
                    to="/dashboard"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }
                >
                    Profile
                </NavLink>
                {adminLinks()}
                <button
                    onClick={handleSignOut}
                    style={{

                    }}
                >
                    Logout
                </button>
            </div>
        )
    }

    const adminLinks = () => {
        if (user) {
            if (user.profile.roles === "ADMIN") {
                return (
                    <div>
                        <NavLink exact to="/admin">
                            Admin
                        </NavLink>
                    </div>
                );
            }
        }
    };

    return (
        <div>
            {props ? loggedInLinks() : loggedOutLinks()}
        </div>
    )
}