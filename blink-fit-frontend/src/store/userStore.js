import { create } from "zustand";

const useUserStore = create((set) => ({
  user: {
    email: "",
    pwd: "",
  },
  surveyAnswers: {},
  setUser: (user) => set({ user }),
  setSurveyAnswers: (answers) => set({ surveyAnswers: answers }),
  resetUser: () => set({ user: { email: "", pwd: "" }, surveyAnswers: {} }),
}));

export default useUserStore;
