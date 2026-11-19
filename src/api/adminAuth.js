import axios from "axios";
import { API_BASE as API_URL } from "../config/api";

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

export function requestPasswordReset(email) {
    return axios.post(`${API_URL}/admin/forgot-password`, {
        email,
    });
}

export function resetAdminPassword(data) {
    return axios.post(`${API_URL}/admin/reset-password`, data);
}
