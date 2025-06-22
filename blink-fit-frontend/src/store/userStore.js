import { create } from "zustand";

const useUserStore = create((set) => ({
  user: {
    id: "",
    pwd: "",
  },
  surveyAnswers: {},
  selectedRoutine: null,
  screenTimeGoal: 0, // 추가: 입력받은 screenTimeGoal 값 저장
  screenTimeCount: 0,
  breakTimeCount: 0,
  breakCompletionCount: 0,
  totalScreenTime: 0, // 초 단위 누적 스크린타임
  totalBreakTime: 0, // 초 단위 누적 브레이크타임
  setUser: (user) => set({ user }),
  setSurveyAnswers: (answers) => set({ surveyAnswers: answers }),
  setSelectedRoutine: (routine) => set({ selectedRoutine: routine }),
  setScreenTimeGoal: (goal) => set({ screenTimeGoal: goal }), // 추가: screenTimeGoal setter
  incrementScreenTime: () =>
    set((state) => ({ screenTimeCount: state.screenTimeCount + 1 })),
  incrementBreakTime: () =>
    set((state) => ({ breakTimeCount: state.breakTimeCount + 1 })),
  incrementBreakCompletion: () =>
    set((state) => ({ breakCompletionCount: state.breakCompletionCount + 1 })),
  addScreenTime: (seconds) =>
    set((state) => ({ totalScreenTime: state.totalScreenTime + seconds })),
  addBreakTime: (seconds) =>
    set((state) => ({ totalBreakTime: state.totalBreakTime + seconds })),
  resetUser: () =>
    set({
      user: { id: "", pwd: "" },
      surveyAnswers: {},
      selectedRoutine: null,
      screenTimeGoal: 0,
      screenTimeCount: 0,
      breakTimeCount: 0,
      breakCompletionCount: 0,
      totalScreenTime: 0,
      totalBreakTime: 0,
    }),
}));

export default useUserStore;
