
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// Get all tours
export function getAdminTours() {
    const token = sessionStorage.getItem("admin_token");

    return axios.get(`${API_URL}/admin/tours`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

// Create a tour
export function createAdminTour(formData) {
    const token = sessionStorage.getItem("admin_token");

    return axios.post(`${API_URL}/admin/tours`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
}

// Get one tour
export function getAdminTour(id) {
    const token = sessionStorage.getItem("admin_token");

    return axios.get(`${API_URL}/admin/tours/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

// Update a tour
export function updateAdminTour(id, formData) {
    const token = sessionStorage.getItem("admin_token");

    return axios.post(
        `${API_URL}/admin/tours/${id}?_method=PUT`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
}

// Delete a tour
export function deleteAdminTour(id) {
    const token = sessionStorage.getItem("admin_token");

    return axios.delete(`${API_URL}/admin/tours/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

// Publish or unpublish a tour
export function toggleAdminTourPublish(id) {
    const token = sessionStorage.getItem("admin_token");

    return axios.patch(
        `${API_URL}/admin/tours/${id}/toggle-publish`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}
