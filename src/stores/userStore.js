import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const username = ref();
  const score = ref();
  const turns = ref();

  const setInfo = (data) => {
    username.value = data.email;
    score.value = data.score;
    turns.value = data.turns;
  };

  const setScore = (data) => {
    score.value = data.currentScore;
    turns.value = data.remainingTurns;
  };

  const clearInfo = () => {
    username.value = null;
    score.value = null;
    turns.value = null;
  };

  return {
    username,
    score,
    turns,
    setInfo,
    setScore,
    clearInfo,
  };
});
