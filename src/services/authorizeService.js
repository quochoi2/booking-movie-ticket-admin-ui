import { requestApiJson } from "@/utils/requestApi";

const AuthorizeService = {
  getUserByRole: async (page, pageSize) => requestApiJson.get(`authorize/getall-employee-permission?page=${page}&pageSize=${pageSize}`),
  getAllPermissions: async () => requestApiJson.get('authorize/getall-permission'),
  assignPermissions: async (data) => requestApiJson.post('authorize/assign-permissions', data),

  // create employee account
  registerEmployee: async (data) => requestApiJson.post(`auth/register`, data),
};

export default AuthorizeService;