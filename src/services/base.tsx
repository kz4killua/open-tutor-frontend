import { getAccessToken } from "@/utilities/token";
import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/`,
  headers: {'Content-Type': 'application/json'},
  validateStatus: (status) => true,
})

instance.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (response) => {
    if (response.status === 401 && typeof window !== 'undefined') {
      window.location.href = `/accounts/signin?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    }
    return response
  }
)

export default instance;