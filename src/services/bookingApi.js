import axios from 'axios'

const API_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export const createBooking = async (bookingData) => {
    const response = await axios.post(
        `${API_URL}/bookings`,
        bookingData
    )

    return response.data
}
