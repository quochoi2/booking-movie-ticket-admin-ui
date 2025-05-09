import { requestApiPublic } from "@/utils/requestApi";
import { jwtDecode } from "jwt-decode";

const AuthService = {
  login: async (username, password) => {
    try {
      const response = await requestApiPublic.post("/auth/login", { username, password });

      if (response?.data?.token?.accessToken) {
        const { accessToken } = response.data.token;
        const userInfo = jwtDecode(accessToken);

        if (userInfo.role !== "admin" && userInfo.role !== "employee") {
          console.error("You are not admin or employee, access denied.");
        }

        localStorage.setItem("accessToken", accessToken);
        return userInfo;
      } else {
        throw new Error("Đăng nhập thất bại. Không tìm thấy token!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    window.location.replace("/auth/sign-in");
  },

  register: async (userData) => {
    try {
      const response = await requestApiPublic.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  },

  getUser: async () => {
    try {
      const response = await requestApi.get("/auth/get-user");
      return response.data;
    } catch (error) {
      console.error("Get user info failed:", error);
      throw error;
    }
  },
};

export default AuthService;
