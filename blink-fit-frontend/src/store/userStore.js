import { create } from "zustand";

const useUserStore = create((set) => ({
  user: {
    id: "",
    email: "",
    pwd: "",
    username: "",
    survey: false,
  },
  surveyAnswers: {},
  selectedRoutine: null,
  screenTimeGoal: 0, // 추가: 입력받은 screenTimeGoal 값 저장
  screenTimeCount: 0,
  breakTimeCount: 0,
  breakCompletionCount: 0,
  totalScreenTime: 0, // 초 단위 누적 스크린타임
  totalBreakTime: 0, // 초 단위 누적 브레이크타임
  oneMoreHourUsed: false, // 한 번만 1시간 연장 허용
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user: { ...user } });
  },
  setSurveyAnswers: (answers) => {
    localStorage.setItem("surveyAnswers", JSON.stringify(answers));
    set({ surveyAnswers: answers });
  },
  setSelectedRoutine: (routine) => {
    localStorage.setItem("selectedRoutine", JSON.stringify(routine));
    set({ selectedRoutine: routine });
  },
  setScreenTimeGoal: (goal) => set({ screenTimeGoal: goal }), // 추가: screenTimeGoal setter
  setRoutineGuide: (guide) => set({ routineGuide: guide }), // 추가: 루틴 가이드 setter
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
  setOneMoreHourUsed: (used) => set({ oneMoreHourUsed: used }),
  resetUser: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("surveyAnswers");
    localStorage.removeItem("selectedRoutine");
    set({
      user: { id: "", email: "", pwd: "", username: "", survey: false },
      surveyAnswers: {},
      selectedRoutine: null,
      screenTimeGoal: 0,
      screenTimeCount: 0,
      breakTimeCount: 0,
      breakCompletionCount: 0,
      totalScreenTime: 0,
      totalBreakTime: 0,
      oneMoreHourUsed: false,
    });
  },
  resetTimes: () =>
    set({
      totalScreenTime: 0,
      totalBreakTime: 0,
      screenTimeCount: 0,
      breakTimeCount: 0,
      breakCompletionCount: 0,
      oneMoreHourUsed: false,
    }),
  resetSurveyAndRoutine: () => {
    localStorage.removeItem("surveyAnswers");
    localStorage.removeItem("selectedRoutine");
    set((state) => ({
      surveyAnswers: {},
      selectedRoutine: null,
      screenTimeGoal: 0,
      screenTimeCount: 0,
      breakTimeCount: 0,
      breakCompletionCount: 0,
      totalScreenTime: 0,
      totalBreakTime: 0,
      oneMoreHourUsed: false,
      routineGuide: null,
      // user 정보(state.user)는 그대로 유지
      user: state.user,
    }));
  },
}));

export default useUserStore;
