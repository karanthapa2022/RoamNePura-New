import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

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