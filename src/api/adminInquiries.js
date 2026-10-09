import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export function getAdminInquiries() {
    const token = sessionStorage.getItem("admin_token");

    return axios.get(`${API_URL}/admin/inquiries`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
}

export function updateInquiryStatus(inquiryId, status) {
    const token = sessionStorage.getItem("admin_token");

    return axios.patch(
        `${API_URL}/admin/inquiries/${inquiryId}/status`,
        { status },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );
}