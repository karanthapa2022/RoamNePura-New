import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export function adminLogin(credentials) {
    return axios.post(`${API_URL}/admin/login`, credentials);
}
export function adminLogout(token) {
    return axios.post(
        `${API_URL}/admin/logout`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );
}
