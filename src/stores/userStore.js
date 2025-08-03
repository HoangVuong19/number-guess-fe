import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const username = ref();
  const score = ref();
  const turns = ref();
  const updatedAt = ref();

  const setInfo = (data) => {
    username.value = data.email;
    score.value = data.score;
    turns.value = data.turns;
    updatedAt.value = data.updatedAt;
  };

  const setScore = (data) => {
    score.value = data.currentScore;
    turns.value = data.remainingTurns;
    updatedAt.value = data.updatedAt;
  };

  const clearInfo = () => {
    username.value = null;
    score.value = null;
    turns.value = null;
    updatedAt.value = null;
  };

  return {
    username,
    score,
    turns,
    updatedAt,
    setInfo,
    setScore,
    clearInfo,
  };
});
