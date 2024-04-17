import axios from 'axios';
import { authStore } from '../stores/auth_store/Store';

const API_URL = import.meta.env.VITE_API_URL;

export async function login(username, password) {

    const response = await axios.post(`${API_URL}/api/login/`, {
        username,
        password,
    });
    const token = response.data.token;

    return token
}

export async function getUser() {
    try {
        const response = await axios.get(`${API_URL}/api/get-user/`, {
            headers: {
                Authorization: `Token ${authStore.getState().token}`,
            },
        });

        const user = response.data;
        return user;
    } catch (error) {
        throw new Error("Failed to get user:", error);
    }
}