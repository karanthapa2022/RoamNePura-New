
import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Fetch all customer reviews.
export function getAdminReviews() {
    const token = sessionStorage.getItem("admin_token");

    return axios.get(`${API_URL}/admin/reviews`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
}

// Approve or reject a review.
export function updateReviewApproval(reviewId, isApproved) {
    const token = sessionStorage.getItem("admin_token");

    return axios.patch(
        `${API_URL}/admin/reviews/${reviewId}/approval`,
        { is_approved: isApproved },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );
}

// Delete a review.
export function deleteAdminReview(reviewId) {
    const token = sessionStorage.getItem("admin_token");

    return axios.delete(`${API_URL}/admin/reviews/${reviewId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
}
