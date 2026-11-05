
import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Public: Get website settings
export function getSiteSettings() {
    return axios.get(`${API_URL}/site-settings`, {
        headers: {
            Accept: "application/json",
        },
    });
}

// Admin: Update website settings
export function updateSiteSettings(formData) {
    const token = sessionStorage.getItem("admin_token");

    return axios.put(`${API_URL}/admin/site-settings`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
}
