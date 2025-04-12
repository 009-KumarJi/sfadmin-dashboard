import axios from 'axios';

// Create a base Axios instance with common configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token, etc.
apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization headers here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling
    // You could redirect to login page on 401, show error notifications, etc.
    if (error.response) {
      // The request was made and the server responded with a status code
      // outside of the range of 2xx
      console.error('API Error:', error.response.data);
      
      // Handle authentication errors
      // if (error.response.status === 401) {
      //   // Redirect to login or refresh token
      // }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Special instance for multipart/form-data requests (file uploads)
const apiUploadClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 30000, // 30 seconds timeout for uploads
});

// Apply the same interceptors to upload client
apiUploadClient.interceptors.request.use(
  apiClient.interceptors.request.handlers[0].fulfilled,
  apiClient.interceptors.request.handlers[0].rejected
);

apiUploadClient.interceptors.response.use(
  apiClient.interceptors.response.handlers[0].fulfilled,
  apiClient.interceptors.response.handlers[0].rejected
);

export { apiClient, apiUploadClient };