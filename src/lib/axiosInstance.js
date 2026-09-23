import axios from "axios";

// Ek hi axios instance pure app mein use hoga, taaki baseURL aur
// interceptors sirf ek jagah likhne padein.
const axiosInstance = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
});

// REQUEST interceptor: har request jaane se pehle chalega.
// Agar login token localStorage mein hai, to usse
// Authorization header mein daal do.
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE interceptor: har response aane ke baad chalega.
// Yahan hum saari errors ko ek common shape mein convert kar dete hain,
// taaki UI code mein har jagah try/catch likhna aasan ho.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong. Please try again.";

    if (error.response) {
      message = error.response.data?.message || message;

      if (error.response.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } else if (error.request) {
      message = "No response from server. Check your internet connection.";
    }

    return Promise.reject({ ...error, message });
  }
);

export default axiosInstance;