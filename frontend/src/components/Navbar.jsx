// import { UserContext } from "../contexts/UserContext"
import Cookies from "js-cookie";

export default function Navbar() {
    // const { user } = useContext(UserContext)
    const handleSignOut = () => {
        Cookies.remove('access_token')
        window.location.reload()
      };

    return (
        <div>Navbar
            <button
                className="link logout-btn"
                onClick={handleSignOut}
                style={{

                }}
            >
                Logout
            </button>
        </div>
    )
}
