import axios from "axios";
import { API_BASE as API_URL } from "../config/api";

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
