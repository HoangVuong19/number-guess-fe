import axiosClient from "@/services/api-common/axiosClient.js";

const ENDPOINT = "/payment";

export const paymentService = {
  createPayment: async (data) => {
    const token = localStorage.getItem("accessToken");
    return await axiosClient.post(`${ENDPOINT}/create-payment`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  completePayment: async (data) => {
    const token = localStorage.getItem("accessToken");
    return await axiosClient.post(`${ENDPOINT}/complete`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
