import { create } from "zustand";

const useUserStore = create((set) => ({
  user: {
    id: "",
    pwd: "",
  },
  surveyAnswers: {},
  setUser: (user) => set({ user }),
  setSurveyAnswers: (answers) => set({ surveyAnswers: answers }),
  resetUser: () => set({ user: { id: "", pwd: "" }, surveyAnswers: {} }),
}));

export default useUserStore;
