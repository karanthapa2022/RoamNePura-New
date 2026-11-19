import axios from "axios";
import { API_BASE as API_URL } from "../config/api";

export function changeAdminPassword(formData) {
    const token = sessionStorage.getItem("admin_token");

    return axios.patch(
        `${API_URL}/admin/change-password`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );
    
}
export function getAdminProfile() {
    const token = sessionStorage.getItem("admin_token");

    return axios.get(`${API_URL}/admin/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
}

export function updateAdminProfile(formData) {
    const token = sessionStorage.getItem("admin_token");

    return axios.patch(`${API_URL}/admin/profile`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
}