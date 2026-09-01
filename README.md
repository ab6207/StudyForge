
# 📚 StudyForge

### AI-Powered Study Assistant

StudyForge is an AI-powered learning platform that transforms **notes and topics into interactive flashcards and quizzes**. It helps students learn faster using AI-generated study material and active recall.

🌐 **Live Demo:** https://study-forge-cyan.vercel.app/
💻 **GitHub:** https://github.com/ab6207/StudyForge

---

## ✨ Features

* 🤖 **AI Flashcard Generation**
* 🧠 **AI Quiz Generation**
* 🔄 **Retest Wrong Answers**
* 🎴 **Interactive Flashcards**
* ⌨️ **Keyboard Navigation**
* 📊 **Quiz Score Tracking**
* 🛡️ **AI Response Validation**
* ⚡ **Fast AI Generation using Groq**
* 💾 **Optional MongoDB Session Storage**
* 🌐 **Fully Deployed on Vercel**

---

## 🎯 How It Works

```text
              STUDYFORGE

                User
                  │
                  ▼
          Enter Notes / Topic
                  │
                  ▼
        ┌───────────────────┐
        │   React Frontend  │
        │      + Vite       │
        └─────────┬─────────┘
                  │
                  │ REST API
                  ▼
        ┌───────────────────┐
        │ Node.js + Express  │
        │      Backend       │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │      Groq AI      │
        │  Content Creation │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │ Flashcards / Quiz │
        └───────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* REST API

### AI

* Groq API
* Structured JSON responses
* Response validation

### Database

* MongoDB
* Mongoose
* Optional session persistence

### Deployment

* GitHub
* Vercel

---

## 📁 Project Structure

```text
StudyForge/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Flashcards.jsx
│   │   │   ├── PromptForm.jsx
│   │   │   ├── Quiz.jsx
│   │   │   └── StateViews.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useAIGenerate.js
│   │   │
│   │   ├── lib/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── api/
│   │   └── index.js
│   │
│   ├── server/
│   │   ├── lib/
│   │   │   ├── groqClient.js
│   │   │   └── validate.js
│   │   │
│   │   ├── models/
│   │   │   └── Session.js
│   │   │
│   │   ├── routes/
│   │   │   ├── generate.js
│   │   │   └── sessions.js
│   │   │
│   │   ├── app.js
│   │   └── index.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ab6207/StudyForge.git
```

```bash
cd StudyForge
```

---

## 📦 Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```text
backend/.env
```

Add:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
PORT=5050
MONGODB_URI=
CORS_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
npm start
```

Backend will run on:

```text
http://localhost:5050
```

---

## 💻 Frontend Setup

Open another terminal.

Go to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5050
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
PORT=5050
MONGODB_URI=
CORS_ORIGIN=http://localhost:5173
```

### Frontend

```env
VITE_API_URL=http://localhost:5050
```

> ⚠️ Never commit your `.env` file or API keys to GitHub.

The `.gitignore` file is configured to prevent environment files from being committed.

Vite exposes variables beginning with `VITE_` to client-side code, so sensitive secrets such as API keys must remain in the backend.

---

## 🤖 Groq AI

StudyForge uses Groq to generate:

* Flashcards
* Multiple-choice questions
* Answers
* Explanations
* Structured learning content

The AI request is handled by the backend so the Groq API key is never exposed to the frontend.

---

## 🧠 AI Response Validation

AI responses are not blindly sent to the frontend.

StudyForge uses a validation pipeline:

```text
AI Response
     │
     ▼
JSON Extraction
     │
     ▼
Schema Validation
     │
     ▼
Data Validation
     │
     ▼
Valid Response
     │
     ▼
Frontend
```

If the AI provider returns an invalid or unexpected response, the backend returns a controlled error instead of allowing the application to crash.

---

## 🎴 Flashcards

The flashcard system allows users to:

* Generate multiple flashcards
* Flip cards
* Navigate between cards
* Review questions and answers
* Use keyboard navigation

Example:

```text
Question
   ↓
[ Flip Card ]
   ↓
Answer
```

---

## 📝 Quiz

The quiz system provides:

* Multiple-choice questions
* Answer selection
* Instant feedback
* Score calculation
* Wrong-answer tracking
* Retest functionality

The **Retest Wrong Answers** feature allows users to practice questions they previously answered incorrectly.

---

## ☁️ Deployment

StudyForge is deployed using **Vercel**.

The frontend and backend are deployed as separate Vercel projects.

### Frontend

```text
Root Directory:
frontend
```

Live URL:

https://study-forge-cyan.vercel.app/

### Backend

```text
Root Directory:
backend
```

Production API:

https://studyforge-backend.vercel.app/

Vercel supports Vite applications and can deploy them directly from a Git repository.

---

## ⚙️ Production Environment Variables

### Backend Vercel Project

Add:

```text
GROQ_API_KEY
GROQ_MODEL
CORS_ORIGIN
MONGODB_URI
```

Example:

```text
GROQ_MODEL=openai/gpt-oss-120b
CORS_ORIGIN=https://study-forge-cyan.vercel.app
```

### Frontend Vercel Project

Add:

```text
VITE_API_URL
```

Value:

```text
https://studyforge-backend.vercel.app
```

Vercel environment variables are configured outside the source code and can be scoped to Production, Preview, or Development. Changes require a new deployment to take effect.

---

## 🔒 Security

StudyForge follows basic security practices:

* 🔐 API keys stored in environment variables
* 🚫 `.env` files excluded from Git
* 🔑 Groq API key stored only on backend
* 🛡️ User input validation
* 🧪 AI response validation
* 🌐 CORS configuration
* 🔒 Sensitive environment variables managed through Vercel

---

## 📸 Screenshots

Add your application screenshots here.

Create a folder:

```text
screenshots/
```

Example:

```text
screenshots/
├── home.png
├── flashcards.png
└── quiz.png
```

---

## 🔮 Future Improvements

* [ ] User authentication
* [ ] Save study sessions
* [ ] Shareable study links
* [ ] Study history
* [ ] Progress dashboard
* [ ] Spaced repetition
* [ ] Difficulty selection
* [ ] PDF/document upload
* [ ] AI study planner
* [ ] Performance analytics
* [ ] Dark mode

---

## 👨‍💻 Author

### Anurag Singh

**B.Tech Computer Science Engineering**

GitHub:
https://github.com/ab6207

---

## 🔗 Project Links

🌐 **Live Demo**
https://study-forge-cyan.vercel.app/

💻 **GitHub Repository**
https://github.com/ab6207/StudyForge

⚙️ **Backend**
https://studyforge-backend.vercel.app/

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project was created for educational and internship purposes.
