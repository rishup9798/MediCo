# MedLog AI 🩺

**MedLog AI** is a full-stack health tracking and AI-assisted analysis platform that helps users record symptoms, medications, lifestyle data, and laboratory reports in one place. It uses **Google Gemini AI** to identify patterns, summarize health information, analyze laboratory reports, and generate structured information that can be discussed with healthcare professionals.

> **Disclaimer:** MedLog AI is an informational health-tracking application. AI-generated insights are not medical diagnoses or treatment recommendations and should be reviewed with a qualified healthcare professional.

---

## ✨ Features

### 📊 Health Dashboard

* Track overall health activity from a centralized dashboard.
* View symptom counts, active medications, lifestyle entries, and uploaded lab reports.
* Visualize symptom severity trends over time.
* Review recently recorded symptoms and active medications.

### 🩹 Symptom Tracking

* Record symptoms with:
  * Date
  * Symptom name
  * Severity
  * Body part
  * Additional notes
* View previously recorded symptoms.

### 💊 Medication Management

* Track medications with:
  * Name
  * Dosage
  * Frequency
  * Start and end dates
  * Adherence
  * Active/inactive status

### 🌱 Lifestyle Tracking

* Record daily lifestyle information including:
  * Sleep duration
  * Mood
  * Stress
  * Nutrition
  * Notes

### 🧪 Laboratory Report Analysis

* Upload laboratory reports as PDF files.
* Extract text from uploaded reports using `pypdf`.
* Send extracted report information to Gemini AI.
* Generate structured laboratory analysis containing:
  * Test names
  * Values
  * Units
  * Reference ranges
  * Flags
  * Summary
  * Questions for a healthcare professional

### 🤖 AI Health Insights

Gemini AI analyzes the user's combined health data to identify:

* Observable health trends
* Possible correlations
* Questions to discuss with a doctor
* Missing context
* Practical tracking suggestions
* Safety considerations

### 👨‍⚕️ Doctor Summary

A dedicated doctor-facing workflow generates a structured summary containing:

* Patient overview
* Current symptoms
* Medications
* Lifestyle information
* Laboratory reports
* Observed patterns
* Points to discuss
* Clinical notes

### 🔐 Authentication & Data Isolation

* User registration and login.
* JWT-based authentication using Django REST Framework SimpleJWT.
* User-specific health records.
* Authenticated API endpoints.
* Each user can access only their own health data.

---

## 🏗️ System Architecture

```text
┌───────────────────────┐
│      React Frontend   │
│     Vite + Recharts   │
└───────────┬───────────┘
            │ REST API
            ▼
┌───────────────────────┐
│    Django Backend     │
│      Django + DRF     │
└───────┬───────┬───────┘
        │       │
        │       └────────────────┐
        ▼                        ▼
┌───────────────┐       ┌─────────────────┐
│ SQLite        │       │ Gemini AI Engine│
│ Database      │       │ Google Gemini   │
└───────────────┘       └─────────────────┘
        │
        ▼
┌───────────────────────┐
│ PDF Laboratory Reports│
│       pypdf           │
└───────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* **React** (JavaScript / JSX)
* **Vite**
* **Framer Motion**
* **Recharts**
* **Lucide React**

### Backend

* **Python**
* **Django**
* **Django REST Framework**
* **SimpleJWT**
* **SQLite**
* **django-cors-headers**

### AI & Document Processing

* **Google Gemini API**
* **Google GenAI SDK**
* **pypdf**

### Development

* **Git**
* **GitHub**
* **Python Virtual Environment**
* **npm**

---

## 📁 Project Structure

```text
MedLog-AI/
│
├── backend/
│   ├── accounts/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── ai_engine/
│   │   ├── analyzer.py
│   │   ├── apps.py
│   │   ├── prompts.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── health/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── reports/
│   │
│   ├── medlog_ai/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── manage.py
│   ├── requirements.txt
│   └── .env                # not committed — see setup below
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Python 3.10+
* Node.js 18+
* npm
* Git
* A Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/MedLog-AI.git
cd MedLog-AI
```

---

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it:

```bash
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

### 3. Configure Environment Variables

Create a `.env` file inside `backend/`:

```env
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
GEMINI_API_KEY=your-gemini-api-key
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

> ⚠️ **Never commit `.env` or expose your Gemini API key publicly.**

---

### 4. Apply Database Migrations

From the `backend` directory:

```bash
python manage.py migrate
```

Optional: create an admin account:

```bash
python manage.py createsuperuser
```

---

### 5. Start the Backend

```bash
python manage.py runserver
```

Backend runs at:

```text
http://127.0.0.1:8000/
```

---

### 6. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173/
```

Open the frontend URL in your browser to use the app.

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                   | Description               |
| ------ | --------------------------- | -------------------------- |
| POST   | `/api/auth/register/`       | Register a user            |
| POST   | `/api/auth/login/`          | Authenticate a user        |
| POST   | `/api/auth/token/refresh/`  | Refresh JWT access token   |

### Health Tracking

| Method   | Endpoint                          | Description                    |
| -------- | ---------------------------------- | -------------------------------- |
| GET/POST | `/api/health/symptoms/`            | Manage symptoms                  |
| GET/POST | `/api/health/medications/`         | Manage medications               |
| GET/POST | `/api/health/lifestyle/`           | Manage lifestyle records         |
| GET/POST | `/api/health/labs/`                | Manage laboratory reports        |
| POST     | `/api/health/labs/<id>/analyze/`   | Analyze a laboratory report      |
| GET      | `/api/health/dashboard/`           | Retrieve dashboard statistics    |
| GET      | `/api/health/doctor-summary/`      | Generate doctor summary          |

### AI

| Method | Endpoint             | Description                   |
| ------ | --------------------- | ------------------------------- |
| POST   | `/api/ai/insights/`   | Generate AI health insights     |

---

## 🔄 AI Workflow

```text
User Health Data
       │
       ▼
Django REST API
       │
       ▼
Health Data Aggregation
       │
       ▼
Structured Gemini Prompt
       │
       ▼
Google Gemini API
       │
       ▼
Structured JSON Response
       │
       ▼
React UI
```

For laboratory reports:

```text
PDF Upload
    │
    ▼
pypdf Text Extraction
    │
    ▼
Gemini Laboratory Analysis
    │
    ▼
Structured Test Information
    │
    ▼
Stored Analysis
    │
    ▼
Frontend
```

---

## 🔒 Security Considerations

* JWT authentication protects API endpoints.
* Health records are associated with authenticated users.
* Users can only retrieve their own health records.
* Gemini API credentials are stored through environment variables.
* Local database and uploaded media files are excluded from version control.
* AI prompts explicitly prohibit diagnosis and treatment recommendations.

---

## ⚠️ Limitations

* AI-generated information can be incomplete or inaccurate.
* PDF text extraction depends on the report containing machine-readable text.
* Scanned/image-only PDFs may not produce useful extracted text.
* Pattern detection depends on the amount and quality of recorded health data.
* The application does not replace professional medical evaluation.

---

## 🔮 Future Improvements

* [ ] PostgreSQL production database
* [ ] Cloud-based file storage
* [ ] Production deployment
* [ ] OCR support for scanned laboratory reports
* [ ] Automated medication reminders
* [ ] More advanced health visualizations
* [ ] Exportable doctor reports
* [ ] Email/notification support
* [ ] Improved AI response validation
* [ ] Automated testing and CI/CD
* [ ] Role-based healthcare-provider access

---

## 📌 Project Highlights

MedLog AI demonstrates practical implementation of:

* Full-stack web development
* REST API design
* JWT authentication
* CRUD-based health data management
* AI/LLM API integration
* Prompt engineering
* PDF document processing
* Structured AI responses
* Data visualization
* User-specific data isolation
* React-Django integration

---

## 📄 License

This project is intended for **educational and portfolio purposes only**. All rights reserved unless otherwise stated by the author.

---

