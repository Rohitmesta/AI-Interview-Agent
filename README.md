# AI Interview Agent

## Overview

AI Interview Agent is a full-stack web application that simulates a technical interview using Google's Gemini AI. The application generates role-specific interview questions, evaluates candidate responses, assigns scores with constructive feedback, and produces an overall interview assessment.

The project was built as a production-oriented implementation for an AI Interview Agent take-home assignment using modern software engineering practices, including a clean project structure, RESTful APIs, database persistence, and AI integration.

---

# Features

- AI-generated interview questions based on the selected job role
- One-question-at-a-time interview experience
- AI-powered evaluation of candidate responses
- Score and feedback for every submitted answer
- Overall interview evaluation after completion
- Stores interview sessions, questions, answers, and evaluations
- Displays complete interview transcript
- Responsive frontend built with React and Tailwind CSS
- RESTful backend built with FastAPI

---

# Technology Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- Vite

## Backend

- Python
- FastAPI
- SQLAlchemy ORM
- SQLite
- Google Gemini 2.5 Flash API
- Uvicorn

---

# System Architecture

```
                  React Frontend
                         │
                         │ Axios
                         ▼
                  FastAPI REST API
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
 Google Gemini API               SQLite Database
          │                             │
          ▼                             ▼
 AI Question Generation         SQLAlchemy ORM
 AI Answer Evaluation           Interview Storage
 Overall Assessment
```

---

# Project Structure

```
AI-Interview-Agent/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── interview_agent.db
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# Application Workflow

```
Candidate enters
Name + Job Role
        │
        ▼
Backend creates Interview Session
        │
        ▼
Gemini generates
5 interview questions
        │
        ▼
Candidate answers
each question
        │
        ▼
Gemini evaluates
every answer
        │
        ▼
Score + Feedback stored
in SQLite
        │
        ▼
Overall AI Evaluation
generated
        │
        ▼
Interview Report displayed
```

---

# Database Design

The application uses SQLite as the relational database.

SQLAlchemy ORM is used to define database models and manage all database operations without writing raw SQL.

The application stores:

- Interview Sessions
- Interview Questions
- Candidate Answers
- Individual Scores
- AI Feedback
- Final Interview Score

### Entity Relationship

```
InterviewSession
       │
       │ One-to-Many
       ▼
InterviewQuestion
       │
       │ One-to-Many
       ▼
InterviewAnswer
```

---

# API Endpoints

## Start Interview

```
POST /api/interview/start
```

Creates a new interview session and generates five AI interview questions.

### Request

```json
{
    "candidate_name": "Rahul",
    "role": "Backend Developer"
}
```

---

## Submit Answer

```
POST /api/interview/answer
```

Evaluates a candidate answer using Gemini AI.

### Request

```json
{
    "question_id": 1,
    "answer": "My answer..."
}
```

---

## Interview Result

```
GET /api/interview/result/{session_id}
```

Returns:

- Interview Details
- Question Transcript
- Candidate Answers
- Individual Scores
- AI Feedback
- Overall AI Evaluation

---

# Installation

## Clone Repository

```bash
git clone https://github.com/<your-username>/AI-Interview-Agent.git

cd AI-Interview-Agent
```

---

# Backend Setup

Navigate to backend.

```bash
cd backend
```

Create virtual environment.

```bash
python -m venv venv
```

Activate environment.

### Windows

```bash
venv\Scripts\activate
```

### Linux/macOS

```bash
source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Create a `.env` file.

```
GEMINI_API_KEY=YOUR_API_KEY
```

Run the backend.

```bash
python -m uvicorn app.main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Navigate to frontend.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Run development server.

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# AI Integration

Google Gemini 2.5 Flash is used for:

- Interview question generation
- Candidate answer evaluation
- Overall interview assessment

To improve reliability, Gemini requests automatically retry when temporary server-side failures occur.

---

# Design Decisions

## FastAPI

FastAPI was selected for its performance, automatic OpenAPI documentation, dependency injection, and clean REST API development.

## React

React provides a component-based architecture suitable for building interactive user interfaces.

## Tailwind CSS

Tailwind CSS enables rapid UI development using utility-first styling while maintaining consistency.

## SQLite

SQLite was chosen as the embedded relational database because it requires no additional server setup and is sufficient for local development and prototype deployments.

## SQLAlchemy

SQLAlchemy ORM is used to define database models, manage relationships between interview sessions, questions, and answers, and perform CRUD operations without writing raw SQL.

## Gemini 2.5 Flash

Gemini 2.5 Flash was selected because it provides fast inference and high-quality natural language understanding suitable for interview question generation and answer evaluation.

---

# Error Handling

The application includes validation and exception handling for:

- Invalid interview sessions
- Missing questions
- Empty answers
- AI service failures
- Temporary Gemini API unavailability
- Database lookup failures

---

# Assumptions

- Interviews consist of five AI-generated questions.
- Candidate responses are text-based.
- Internet connectivity is required for Gemini API access.
- One interview session evaluates a single candidate for one job role.

---

# Future Improvements

Potential enhancements include:

- Voice-based interviews
- Adaptive question generation based on previous answers
- User authentication
- Interview history dashboard
- PDF report generation
- Docker support
- PostgreSQL for production deployment
- Deployment on cloud platforms
- Multiple AI model support
- Role-specific evaluation rubrics

---

# Screenshots

Include screenshots of the following pages:

1. Home Page
/frontend/screenshots/HomePage.png

2. Interview Page
/frontend/screenshots/InterviewPage.png

3. Result Page
/frontend/screenshots/ResultPage.png
/frontend/screenshots/ResultPage1.png
/frontend/screenshots/ResultPage2.png



---

# Author

Rohit M

Built as part of an AI Interview Agent take-home assignment.
