import axios from "axios";
axios.interceptors.request.use(
  (config) => {
    // Modify config before request is sent
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // Modify response data before it's passed to the application
    return response;
  },
  (error) => {
    // Handle response error
    return Promise.reject(error);
  }
);

export default axios;
