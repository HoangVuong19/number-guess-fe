import axiosClient from "@/services/api-common/axiosClient.js";

const ENDPOINT = "/auth";

export const authService = {
  login: async (params) => {
    return await axiosClient.post(`${ENDPOINT}/login`, params);
  },

  register: async (params) => {
    return await axiosClient.post(`${ENDPOINT}/register`, params);
  },
};
