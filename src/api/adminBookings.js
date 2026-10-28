
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export function getAdminBookings() {
    const token = sessionStorage.getItem("admin_token");

    return axios.get(`${API_URL}/admin/bookings`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
}
