import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/`,
  headers: {'Content-Type': 'application/json'},
  validateStatus: (status) => true,
})

export default instance;