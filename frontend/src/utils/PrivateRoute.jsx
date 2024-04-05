import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const API_URL = import.meta.env.API_URL;

export default function PrivateRoute({ element }) {
    const isAuthenticated = !!Cookies.get('access_token');
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            getUser();
        }
    }, [isAuthenticated]);

    const getUser = () => {
        const token = Cookies.get('access_token');
        if (token) {
            Axios.get(`${API_URL}/api/get-user/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
                .then((res) => {
                    setUser(res.data.user);
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                });
        }
    };

    return isAuthenticated ? element : <Navigate to="/login" />;
}

PrivateRoute.propTypes = {
    element: PropTypes.node.isRequired,
  };