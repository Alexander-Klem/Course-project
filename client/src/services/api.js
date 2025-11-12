import axios from 'axios';
// process.env.REACT_APP_API_URL ||
const api = axios.create({
  baseURL:  'http://localhost:7000/api', 
  headers: {
    'Content-Type': 'application/json',
  }
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;