import secret from "@/secret";
import axios from "axios";

// Instance cho các API cần xác thực
export const requestApiFile = axios.create({
  baseURL: secret.API,
  headers: {
    "Accept": "application/json",
    'Content-Type': 'multipart/form-data'
  },
});

export const requestApiJson = axios.create({
  baseURL: secret.API,
  headers: {
    "Accept": "application/json",
    'Content-Type': 'application/json'
  },
});

const addAuthInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalConfig = error.config;

      if (error.response?.status === 403 && !originalConfig._retry) {
        originalConfig._retry = true; // Đánh dấu đã retry
        try {
          console.log("Call refresh token API");

          const refreshResponse = await axios.post(`${secret.API}/auth/renew-token`, {
            accessToken: localStorage.getItem("accessToken"),
          });

          const { accessToken } = refreshResponse.data.token;

          localStorage.setItem("accessToken", accessToken);

          originalConfig.headers["Authorization"] = `Bearer ${accessToken}`;

          // Thực hiện lại request ban đầu
          return axiosInstance(originalConfig);
        } catch (err) {
          console.error("Failed to refresh token:", err);

          if (err.response?.status === 400) {
            // Logout người dùng nếu lỗi 400
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          }
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(requestApiFile);
addAuthInterceptor(requestApiJson);

// Thêm interceptor cho requestApi để xử lý token
// requestApi.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// requestApi.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalConfig = error.config;

//     if (error.response?.status === 403 && !originalConfig._retry) {
//       originalConfig._retry = true; // Đánh dấu đã retry
//       try {
//         console.log("Call refresh token API");

//         const refreshResponse = await axios.post(`${secret.API}/auth/renew-token`, {
//           accessToken: localStorage.getItem("accessToken"),
//         });

//         const { accessToken } = refreshResponse.data.token;

//         localStorage.setItem("accessToken", accessToken);

//         originalConfig.headers["Authorization"] = `Bearer ${accessToken}`;

//         // Thực hiện lại request ban đầu
//         return requestApi(originalConfig);
//       } catch (err) {
//         console.error("Failed to refresh token:", err);

//         if (err.response?.status === 400) {
//           // Logout người dùng nếu lỗi 400
//           localStorage.removeItem("accessToken");
//           window.location.href = "/login";
//         }
//         return Promise.reject(err);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// Instance cho các API không cần xác thực
export const requestApiPublic = axios.create({
  baseURL: secret.API,
  headers: {
    "Accept": "application/json",
    'Content-Type': 'application/json',
  },
});

// Xử lý lỗi chung cho requestApiPublic
requestApiPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);