export const API_BASE_URL = "http://127.0.0.1:8000/api";
export const STORAGE_URL = "http://127.0.0.1:8000/storage";

export const getStorageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${STORAGE_URL}/${path}`;
};
