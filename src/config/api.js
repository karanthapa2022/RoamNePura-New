export const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

export function getStorageUrl(image) {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const imagePath = image.replace(/^\/+/, "");

  if (imagePath.startsWith("storage/")) {
    return `${API_ORIGIN}/${imagePath}`;
  }

  return `${API_ORIGIN}/storage/${imagePath}`;
}