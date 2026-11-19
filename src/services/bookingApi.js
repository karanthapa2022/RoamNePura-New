import axios from 'axios'
import { API_BASE as API_URL } from "../config/api";

export const createBooking = async (bookingData) => {
    const response = await axios.post(
        `${API_URL}/bookings`,
        bookingData
    )

    return response.data
}
