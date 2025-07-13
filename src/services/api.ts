import axios from 'axios';

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_SECRET,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiInstance; 