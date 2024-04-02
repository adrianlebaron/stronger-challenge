import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from 'prop-types';

export default function Navbar(props) {
    const { user } = useContext(UserContext)

    const handleSignOut = () => {
        Cookies.remove('access_token')
        window.location.reload()
    };

    const loggedOutLinks = () => {
        return (
            <div>
                <div>
                    <NavLink
                        to="/"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >
                        Home
                    </NavLink>
                </div>
                <div>
                    <NavLink
                        to="/"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >
                        Shop
                    </NavLink>
                </div>
                <div>
                    <NavLink
                        to="/"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >
                        Register
                    </NavLink>
                </div>
                <div>
                    <NavLink
                        to="/"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >
                        Sign In
                    </NavLink>
                </div>
            </div>
        );
    };

    const loggedInLinks = () => {
        return (
            <div>
                <div >
                    <NavLink
                        to="/"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >
                        Home
                    </NavLink>
                </div>
                <div >
                    <NavLink
                        to="/"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >
                        Shop
                    </NavLink>
                </div>
                <div>
                    <NavLink
                        to="/"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >
                        Feed
                    </NavLink>
                </div>
                <div >
                    <NavLink
                        to="/"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >
                        Score
                    </NavLink>
                </div>
                <div >
                    <NavLink
                        to="/"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >
                        Dashboard
                    </NavLink>
                </div>

                <div>
                    <NavLink
                        to="/"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >
                        Profile
                    </NavLink>
                </div>
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

console.log('PROPS', props)
    return (
        <div>
            {props ? loggedInLinks() : loggedOutLinks()}
            {console.log('PROPS', props)}
        </div>
    )
}

// Navbar.propTypes = {
//     isAuthenticated: PropTypes.bool.isRequired
//   };