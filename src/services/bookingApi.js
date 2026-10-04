import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const createBooking = async (bookingData) => {
    const response = await axios.post(
        `${API_URL}/bookings`,
        bookingData

    )

    return response.data
}