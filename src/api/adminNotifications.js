import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function getAdminHeaders() {
    const token = sessionStorage.getItem("admin_token");

    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
    };
}


export function getAdminNotifications(page = 1, filters = {}) {
  return axios.get(`${API_URL}/admin/notifications`, {
    headers: getAdminHeaders(),
    params: {
      page,
      ...(filters.type && filters.type !== "all"
        ? { type: filters.type }
        : {}),
      ...(filters.status && filters.status !== "all"
        ? { status: filters.status }
        : {}),
    },
  });
}


export function markAdminNotificationAsRead(id) {
    return axios.patch(
        `${API_URL}/admin/notifications/${id}/read`,
        {},
        { headers: getAdminHeaders() }
    );
}

export function markAllAdminNotificationsAsRead() {
    return axios.patch(
        `${API_URL}/admin/notifications/read-all`,
        {},
        { headers: getAdminHeaders() }
    );
}
