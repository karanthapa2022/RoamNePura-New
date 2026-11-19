import axios from "axios";
import { API_BASE as API_URL } from "../config/api";

export function createInquiry(data) {
    return axios.post(`${API_URL}/inquiries`, data);
}