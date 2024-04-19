import axios from "axios";
import { clearCookie } from './../../Lib/auth'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from '../../Lib/auth'

axios.interceptors.request.use(
  (config) => {
    // Modify config before request is sent
    config.headers['Authorization'] = "Bearer "+getCookie('token');
    // return config;
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {

    if (response.config.method === "post" || response.config.method === "patch" || response.config.method === "delete" || response.config.method === "put") {
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }
    // Modify response data before it's passed to the application
    return response;
  },
  (error) => {
    // Handle response error
    // token expired
    if (error.response.status === 401) {
      clearCookie('token')
    }

    return Promise.reject(error);
  }
);

export default axios;
