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
  oneMoreHourUsed: false, // 한 번만 1시간 연장 허용
  routineGuide: null, // 추가: 서버에서 받은 루틴 가이드 값 저장
  setUser: (user) => set({ user }),
  setSurveyAnswers: (answers) => set({ surveyAnswers: answers }),
  setSelectedRoutine: (routine) => set({ selectedRoutine: routine }),
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
      oneMoreHourUsed: false,
      routineGuide: null,
    }),
  resetTimes: () =>
    set({
      totalScreenTime: 0,
      totalBreakTime: 0,
      screenTimeCount: 0,
      breakTimeCount: 0,
      breakCompletionCount: 0,
      oneMoreHourUsed: false,
    }),
  resetSurveyAndRoutine: () =>
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
    })),
}));

export default useUserStore;
