# 🚀 **QuizMaster – AI-Powered Interview Practice & Quiz Platform**  
A full-stack quiz platform that generates MCQs using **Google Gemini AI**, evaluates your answers, tracks performance, and provides improvement suggestions — all with a beautiful responsive UI.

## 🔗 **Live Demo**
Frontend: https://quiz-master-six-tau.vercel.app/display  
Backend API: https://quizmaster-2-icg5.onrender.com

## 📸 **Preview**
Add these little later

## ⭐ **Features**
🧠 AI MCQs  
🎯 Practice/Test modes  
📊 Dashboard  
🤖 AI suggestions  
🔐 Clerk auth  
📱 Responsive design  

## 🛠️ **Tech Stack**
Frontend: React, Bootstrap, Clerk  
Backend: Node.js, Express, MongoDB, Gemini AI  

## 📁 Project Structure
```text
AI/
│
├── Client/               # Frontend
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Appbar.jsx
│   │   ├── Display.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Questions.jsx
│   │   ├── ShowIncorrect.jsx
│   │   ├── Options.jsx
│   │   └── Styles/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
└── server/               # Backend
    ├── server.js
    ├── .env
    ├── package.json
    └── node_modules/
```
## 🖥 Frontend Setup
```bash
cd client
npm install
npm run dev
```
## 📦 Backend Setup
```bash
cd server
npm install

```
## 🔧 Create `.env` File
```ini
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
```

## ▶️ Run Server
```bash
cd server
node server.js
```
## 🧠 User Schema
```json
{
  "clerkId": "string",
  "username": "string",
  "scores": [
    {
      "topic": "string",
      "score": 0,
      "correct": 0,
      "incorrect": 0,
      "unattempted": 0,
      "date": "Date"
    }
  ]
}
```

## 🔌 API Endpoints

### 🟦 GET /api/user/:id
Returns user data + aggregated totals.

### 🟦 GET /api/leaderboard
Returns users sorted by average score.

### 🟩 POST /api/mcqs
Generates 10 MCQs using Gemini AI.

#### Request Body:
```json
{ "topic": "DSA" }
```

### 🟩 POST /api/review
Returns explanation + why chosen answer is wrong.

#### Request Body:
```json
{
  "question": "...",
  "selectedAnswer": "..."
}
```

### 🟩 POST /api/finish
Stores quiz results + generates AI suggestions.

#### Request Body:
```json
{
  "userid": "clerk_id",
  "username": "John",
  "score": 7,
  "topic": "OS",
  "correct": 7,
  "incorrect": 2,
  "unattempted": 1
}
```

