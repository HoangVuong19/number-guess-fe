import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref();

  const setAccessToken = (token) => {
    accessToken.value = token;
    localStorage.setItem("accessToken", token);
  };

  const clearAccessToken = () => {
    accessToken.value = null;
    localStorage.removeItem("accessToken");
  };

  return {
    accessToken,
    setAccessToken,
    clearAccessToken,
  };
});
