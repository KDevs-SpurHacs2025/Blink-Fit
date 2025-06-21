# Blink-Fit Backend - Refactored Architecture

## 👋 For New Team Members

**Welcome! This is the backend API for the Blink-Fit eye health project.**

🚀 **What this does**: Provides AI-powered eye health recommendations through a REST API  
🛠️ **Tech stack**: Node.js + TypeScript + Firebase Functions + Google Gemini AI  
⏱️ **Setup time**: ~10 minutes (if you follow the guide below)

**Never worked with Firebase or Node.js before?** No problem! Follow our step-by-step guide below 👇

---

## 🎯 Overview

The Blink-Fit backend is a Firebase Functions-based API service that provides AI-powered eye health management. Built with Node.js, Express.js, and Google Gemini AI, it delivers personalized eye care recommendations and exercise guides to prevent digital eye strain.

## ✨ Key Features

- **AI-Powered Greetings**: Personalized welcome messages using Google Gemini AI
- **Eye Health Assessment**: Comprehensive quiz analysis with risk level calculation
- **Personalized Guides**: AI-generated recommendations based on user data and preferences
- **Dynamic Exercise Suggestions**: Real-time break activities tailored to user preferences
- **Fallback System**: Rule-based algorithms ensure service continuity when AI is unavailable
- **Secure Configuration**: Firebase Secret Manager for API key management

## 📁 Project Structure (Refactored)

```
functions/src/
├── index.ts                 # Main entry point & Firebase Functions export
├── config/
│   └── index.ts            # Configuration & environment variables
├── types/
│   └── index.ts            # TypeScript type definitions
├── services/
│   └── geminiService.ts    # Gemini AI service (Singleton pattern)
├── controllers/
│   ├── helloController.ts  # Hello API handlers
│   ├── guideController.ts  # Guide generation handlers
│   └── exerciseController.ts # Exercise guide handlers
├── routes/
│   └── index.ts            # Express route definitions
└── utils/
    └── helpers.ts          # Utility functions & fallback logic
```

## 🔧 Major Improvements (Refactoring)

### 1. **Modularized Architecture**
- **Before**: 503 lines in a single file
- **After**: 9 well-organized modules
- Each component has a single responsibility
- Enhanced code reusability and maintainability

### 2. **Service Layer Separation**
- `GeminiService`: Singleton pattern for AI service management
- Encapsulated initialization, error handling, and retry logic
- Memory efficiency and connection reuse

### 3. **Type Safety**
- Complete TypeScript interfaces for all API requests/responses
- Compile-time error detection
- IDE autocomplete and refactoring support

### 4. **Standardized Error Handling**
- Consistent API response format
- Centralized error processing
- Enhanced fallback mechanisms

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/hello` | AI-powered greeting generation |
| POST | `/api/hello` | AI conversation response |
| POST | `/api/generate-guide` | Personalized eye health guide generation |
| POST | `/api/exercise-guidance` | Dynamic exercise guide generation |

## 🔑 Core Components

### GeminiService (Singleton)
```typescript
const geminiService = GeminiService.getInstance();
geminiService.initialize();
await geminiService.generateGreeting("userName");
```

### Standardized API Response
```typescript
{
  success: boolean,
  message?: string,
  data?: any,
  timestamp: string,
  source?: string,
  error?: string
}
```

### Fallback System
- Automatic rule-based responses when Gemini API fails
- Ensures continuous user experience
- Enhanced service reliability

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run serve

# Build TypeScript
npm run build

# Deploy to Firebase
npm run deploy

# View logs
npm run logs
```

## ⚙️ Environment Variables

- `GOOGLE_API_KEY`: Gemini AI API key (managed via Firebase Secret Manager)
- `NODE_ENV`: Environment setting (development/production)

## 🔐 Security Features

- Firebase Secret Manager for API key management
- CORS configuration for domain access control
- Input data validation and type checking
- Secure authentication with Firebase

## 📊 Monitoring & Logging

- Automatic Firebase Functions log collection
- Structured logging for enhanced debugging efficiency
- Error tracking and performance monitoring

## 🚀 Deployment

**Production URL**: `https://northamerica-northeast2-kdev-59789.cloudfunctions.net/api`

**Deployment Status**: ✅ All API endpoints operational
- ✅ Gemini AI integration working
- ✅ Fallback system functional
- ✅ Error handling verified

## 📚 Getting Started for Beginners

### 🔧 Prerequisites (Required Software)

Before starting, make sure you have these installed on your computer:

#### 1. **Node.js** (JavaScript Runtime)
- **What it is**: Node.js allows you to run JavaScript code on your computer
- **Download**: Go to [nodejs.org](https://nodejs.org/)
- **Install**: Download the LTS version (18.x or higher)
- **Verify installation**: Open terminal/command prompt and type:
  ```bash
  node --version
  npm --version
  ```
  You should see version numbers like `v18.x.x` and `9.x.x`

#### 2. **Git** (Version Control)
- **What it is**: Git helps you download and manage code
- **Download**: Go to [git-scm.com](https://git-scm.com/)
- **Install**: Follow the installation wizard
- **Verify installation**: In terminal, type:
  ```bash
  git --version
  ```

#### 3. **Firebase CLI** (Firebase Command Line Tools)
- **What it is**: Tools to work with Firebase services
- **Install**: After Node.js is installed, run:
  ```bash
  npm install -g firebase-tools
  ```
- **Verify installation**:
  ```bash
  firebase --version
  ```

#### 4. **Code Editor** (Recommended: VS Code)
- **Download**: [Visual Studio Code](https://code.visualstudio.com/)
- **Why**: Best editor for JavaScript/TypeScript with great extensions

### 📂 Step-by-Step Setup Guide

#### Step 1: Clone the Project
```bash
# Open terminal/command prompt
# Navigate to where you want to save the project
cd Desktop  # or wherever you want

# Clone the repository
git clone https://github.com/euniejo/Blink-Fit.git

# Enter the project folder
cd Blink-Fit/blink-fit-backend
```

#### Step 2: Install Project Dependencies
```bash
# Navigate to the functions folder
cd functions

# Install all required packages (this might take a few minutes)
npm install

# You should see a "node_modules" folder created
```

#### Step 3: Set Up Environment File
```bash
# In the functions folder, create a .env file
# On Windows:
echo. > .env

# On Mac/Linux:
touch .env
```

Open the `.env` file in your code editor and add:
```
GOOGLE_API_KEY=your-gemini-api-key-here
NODE_ENV=development
```

**Note**: Ask your team lead for the actual `GOOGLE_API_KEY` value.

#### Step 4: Firebase Setup
```bash
# Go back to the main project folder
cd ..  # (you should be in blink-fit-backend folder now)

# Login to Firebase (this will open a browser)
firebase login

# Follow the browser prompts to login with Google account
```

### 🚀 Running the Project Locally

#### Method 1: Using Firebase Emulator (Recommended)
```bash
# Make sure you're in the backend project folder
cd Blink-Fit/blink-fit-backend
pwd  # should show .../Blink-Fit/blink-fit-backend

# Start the Firebase emulator
firebase emulators:start --only functions

# Wait for the message: 
# "✔ All emulators ready! It is now safe to connect your app."
```

**What you'll see:**
- The emulator will start on `http://localhost:5001`
- Firebase Emulator UI will be available at: `http://localhost:4000` (or another port if 4000 is busy)
- Your API will be available at: `http://localhost:5001/kdev-59789/northamerica-northeast2/api`
- You'll see console logs showing "Functions emulator ready"

#### Method 2: Using NPM Scripts
```bash
# Navigate to functions folder
cd functions

# Start the development server
npm run serve

# This does the same as Method 1 but from the functions folder
```

### 🧪 Testing Your Local Setup

Once the emulator is running, test these URLs in your browser or with curl:

#### 1. Health Check
Open browser and go to:
```
http://localhost:5001/kdev-59789/northamerica-northeast2/api/
```
You should see: `{"message":"Firebase Functions v2 server is running!"}`

#### 2. Hello API Test
```
http://localhost:5001/kdev-59789/northamerica-northeast2/api/api/hello?name=YourName
```

#### 3. Using curl (Terminal/Command Prompt)
```bash
# Test health check
curl http://localhost:5001/kdev-59789/northamerica-northeast2/api/

# Test hello API
curl "http://localhost:5001/kdev-59789/northamerica-northeast2/api/api/hello?name=TestUser"

# Test guide generation (complex example)
curl -X POST "http://localhost:5001/kdev-59789/northamerica-northeast2/api/api/generate-guide" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "quiz": [
      {"answer": "Computer", "level": 3},
      {"answer": "None", "level": 1},
      {"answer": "Sometimes", "level": 2},
      {"answer": "6-8 hours", "level": 3},
      {"answer": "Rarely", "level": 3},
      {"answer": "Moderate", "level": 2},
      {"answer": "Sometimes", "level": 2}
    ],
    "subjective": {
      "breakPreference": "Short breaks",
      "favoriteSnack": "Coffee",
      "favoritePlace": "Garden"
    }
  }'
```

### 🔧 Development Workflow

#### Making Code Changes
1. **Edit files** in the `functions/src/` folder using your code editor
2. **Save your changes**
3. The emulator will automatically **reload** (hot reload)
4. **Test** your changes using the URLs above

#### Common Commands
```bash
# Check if TypeScript compiles without errors
npm run build

# Stop the emulator
# Press Ctrl+C in the terminal where emulator is running

# Restart the emulator
firebase emulators:start --only functions

# View emulator logs (in another terminal)
firebase emulators:logs
```

### 📁 Project Structure Explanation

```
Blink-Fit/
├── blink-fit-backend/         # Backend API (Firebase Functions)
│   ├── functions/            # Main code folder
│   │   ├── src/             # Source code (TypeScript)
│   │   │   ├── index.ts     # Main entry point
│   │   │   ├── config/      # Configuration files
│   │   │   ├── controllers/ # API route handlers
│   │   │   ├── services/    # Business logic (Gemini AI)
│   │   │   ├── types/       # TypeScript type definitions
│   │   │   ├── utils/       # Helper functions
│   │   │   └── routes/      # API route definitions
│   │   ├── lib/             # Compiled JavaScript (auto-generated)
│   │   ├── package.json     # Dependencies list
│   │   ├── tsconfig.json    # TypeScript configuration
│   │   └── .env             # Environment variables (you create this)
│   ├── firebase.json         # Firebase configuration
│   ├── .firebaserc          # Firebase project settings
│   └── README.md            # This file
└── blink-fit-frontend/       # Frontend Chrome Extension
    └── (frontend files...)
```

### ❗ Troubleshooting Common Issues

#### Issue 1: "firebase: command not found"
**Solution**: Firebase CLI not installed properly
```bash
npm install -g firebase-tools
```

#### Issue 2: "node: command not found"
**Solution**: Node.js not installed
- Download and install from [nodejs.org](https://nodejs.org/)

#### Issue 3: Emulator won't start
**Solution**: Check if port is already in use
```bash
# Kill processes using port 5001
# On Mac/Linux:
lsof -ti:5001 | xargs kill -9

# On Windows:
netstat -ano | findstr :5001
# Then kill the process ID shown
```

#### Issue 4: "Permission denied" errors
**Solution**: Run with proper permissions
```bash
# On Mac/Linux, try adding sudo:
sudo npm install -g firebase-tools

# Or fix npm permissions:
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### Issue 5: TypeScript errors
**Solution**: Check your code syntax and types
```bash
# Check for TypeScript errors
cd functions
npm run build
```

### 🆘 Getting Help

1. **Check the console output** - errors usually show helpful messages
2. **Ask team members** - don't hesitate to ask questions
3. **Check Firebase logs**:
   ```bash
   firebase emulators:logs
   ```
4. **Restart everything**:
   ```bash
   # Stop emulator (Ctrl+C)
   # Then restart:
   firebase emulators:start --only functions
   ```

### ❓ Frequently Asked Questions (FAQ)

#### Q: The emulator starts but I can't access the API
**A**: Check the exact URL in the console output. Sometimes ports change if they're busy.

#### Q: I get "GOOGLE_API_KEY not set" warning
**A**: This is normal for local development. The API will work with fallback responses.

#### Q: My code changes aren't showing up
**A**: 
- Make sure you saved the file
- Check the console for TypeScript errors
- Try running `npm run build` in the functions folder

#### Q: I see "permission denied" errors
**A**: 
- On Mac/Linux: Try `sudo npm install -g firebase-tools`
- Make sure you have admin rights on Windows

#### Q: The emulator won't start
**A**: 
- Check if another emulator is already running
- Try changing the port in firebase.json
- Restart your computer if all else fails

#### Q: How do I know if the API is working?
**A**: 
- Open `http://localhost:5001/kdev-59789/northamerica-northeast2/api/` in browser
- You should see: `{"message":"Firebase Functions v2 server is running!"}`

#### Q: Can I use Postman to test the API?
**A**: Yes! Use the local emulator URLs instead of the production ones.

### 📝 Quick Reference

**Start Development:**
```bash
cd Blink-Fit/blink-fit-backend
firebase emulators:start --only functions
```

**Test API:**
```
http://localhost:5001/kdev-59789/northamerica-northeast2/api/
```

**Stop Development:**
```
Press Ctrl+C in terminal
```

---

## ⚡ Quick Start (5 minutes)

**For team members who just want to get started quickly:**

1. **Install Node.js** from [nodejs.org](https://nodejs.org/) (LTS version)
2. **Install Firebase CLI**: `npm install -g firebase-tools`
3. **Clone project**: `git clone https://github.com/euniejo/Blink-Fit.git`
4. **Navigate**: `cd Blink-Fit/blink-fit-backend/functions`
5. **Install**: `npm install`
6. **Go back**: `cd ..`
7. **Start**: `firebase emulators:start --only functions`
8. **Test**: Open `http://localhost:5001/kdev-59789/northamerica-northeast2/api/`

**Need help?** Read the detailed guide above! 👆

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run serve

# Build TypeScript
npm run build

# View logs
npm run logs
```

## 🧪 Testing

API endpoints can be tested using the following examples:

```bash
# Health check
curl https://northamerica-northeast2-kdev-59789.cloudfunctions.net/api/

# AI greeting
curl "https://northamerica-northeast2-kdev-59789.cloudfunctions.net/api/api/hello?name=TestUser"

# Generate guide
curl -X POST "https://northamerica-northeast2-kdev-59789.cloudfunctions.net/api/api/generate-guide" \
  -H "Content-Type: application/json" \
  -d '{"userId": "test", "quiz": [/* quiz data */]}'
```

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

**Refactoring Benefits:**
- ✅ 503 lines → Modular, organized structure
- ✅ Single Responsibility Principle applied
- ✅ Enhanced testability
- ✅ Significantly improved code readability and maintainability