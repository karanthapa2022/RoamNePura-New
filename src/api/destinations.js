import axios from "axios";
import { API_BASE as API_URL } from "../config/api";

export function getDestinations() {
    return axios.get(`${API_URL}/destinations`);
}

export function getDestination(slug) {
    return axios.get(`${API_URL}/destinations/${slug}`);
}
