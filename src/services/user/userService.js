import axiosClient from "@/services/api-common/axiosClient.js";

export const userService = {
  me: async (data) => {
    const token = localStorage.getItem("accessToken");
    return await axiosClient.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
  },

  guess: async (guessNumber) => {
    const token = localStorage.getItem("accessToken");
    return await axiosClient.post(
      "/guess",
      { guess: guessNumber },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
