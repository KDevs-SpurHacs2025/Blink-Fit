# 👁️ Blink-FIT

![BlinkFitIcon-Unbg-green](https://github.com/user-attachments/assets/ae4f46a6-ee4c-45b6-86f8-8a0842898dad)![BlinkFitIcon-Unbg-black](https://github.com/user-attachments/assets/818b7b3f-1915-4209-907c-b7cbb30ad2ee)



**Blink-FIT** is a Chrome Extension designed to protect users from digital eye strain by promoting healthy screen-time habits.

## 🚀 What It Does

Blink-FIT uses real-time webcam tracking to monitor blink frequency and encourage proper screen distance. When it's time for a break, it offers personalized suggestions using AI.

### Key Features:
- 🔴 Blink detection with live feedback
- 🟠 Screen distance monitoring
- 🧠 AI-generated micro & regular break suggestions using **Gemini API**
- 📊 7-section screen-time & break history summary
- ✅ Responsive UI as a Chrome Extension

## 💡 Inspiration

We wanted to address the growing issue of **Computer Vision Syndrome** and **Dry Eye Disease** by creating a tool that gives smart, science-based reminders while respecting user preferences.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **AI**: Google Gemini API (LLM)
- **Backend/DB**: Firebase, MongoDB Atlas
- **Tools**: GitHub Copilot, Vite, Zustand, FaceLandmarker API

## 🧪 How We Built It

- Integrated Mediapipe’s FaceLandmarker to detect eye activity
- Used Zustand for global state management across the extension
- Queried Gemini API with user survey inputs to provide personalized break routines
- Stored user logs via MongoDB Atlas
- Designed and deployed as a Chrome Extension

## 📹 Demo

- [YouTube Demo Link](https://www.youtube.com/watch?v=ihObeVYWngo)  
- [Devpost Submission](https://devpost.com/software/blink-fit)

## 📄 License

MIT


