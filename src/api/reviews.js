import axios from 'axios'
import { API_BASE as API_URL } from "../config/api";

// Fetch approved customer reviews.
export function getReviews() {
    return axios.get(`${API_URL}/reviews`)
}

// Submit a customer review.
export function submitReview(reviewData) {
    return axios.post(`${API_URL}/reviews`, reviewData)
}
