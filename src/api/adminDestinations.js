import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export function getAdminDestinations() {
    const token = sessionStorage.getItem("admin_token");

    return axios.get(`${API_URL}/admin/destinations`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
export function createAdminDestination(formData) {
    const token = sessionStorage.getItem("admin_token");

    return axios.post(
        `${API_URL}/admin/destinations`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
}
export function getAdminDestination(id) {
    const token = sessionStorage.getItem("admin_token");

    return axios.get(`${API_URL}/admin/destinations/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
export function updateAdminDestination(id, formData) {
    const token = sessionStorage.getItem("admin_token");

    return axios.post(
        `${API_URL}/admin/destinations/${id}?_method=PUT`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
}
export function deleteAdminDestination(id) {
    const token = sessionStorage.getItem("admin_token");

    return axios.delete(
        `${API_URL}/admin/destinations/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}
export function toggleAdminDestinationPublish(id) {
    const token = sessionStorage.getItem("admin_token");

    return axios.patch(
        `${API_URL}/admin/destinations/${id}/toggle-publish`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}