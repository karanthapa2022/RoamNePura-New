
import axios from "axios";
import { API_BASE as API_URL } from "../config/api";

function getAdminHeaders() {
    const token = sessionStorage.getItem("admin_token");

    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
    };
}

export function getAdminBookings() {
    return axios.get(`${API_URL}/admin/bookings`, {
        headers: getAdminHeaders(),
    });
}

export function updateAdminBookingStatus(id, status) {
    return axios.patch(
        `${API_URL}/admin/bookings/${id}/status`,
        { status },
        {
            headers: getAdminHeaders(),
        }
    );
}
