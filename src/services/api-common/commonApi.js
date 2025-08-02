import axiosClient from "@/services/api-common/axiosClient.js";
import { getAccessToken } from "@/utils/auth.js";

const ENDPOINT = "/healthcheck";

export const healthcheckApi = {
  healthcheck: async () => {
    const token = await getAccessToken();
    return await axiosClient.get(ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
