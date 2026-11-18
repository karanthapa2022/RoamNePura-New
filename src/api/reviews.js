import axios from 'axios'

const API_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

// Fetch approved customer reviews.
export function getReviews() {
    return axios.get(`${API_URL}/reviews`)
}

// Submit a customer review.
export function submitReview(reviewData) {
    return axios.post(`${API_URL}/reviews`, reviewData)
}
