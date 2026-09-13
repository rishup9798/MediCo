# MedLog AI 🩺

MedLog AI is a full-stack health tracking app. Users log symptoms, medications, lifestyle habits, and lab reports in one place, and **Google Gemini AI** turns that data into plain-language summaries, patterns, and questions worth raising with a doctor.

> **Disclaimer:** This is an informational tool, not a diagnostic one. AI output should always be reviewed by a healthcare professional.

---

## What it does

| Area | What you can do |
|---|---|
| **Dashboard** | See symptom counts, active medications, and severity trends at a glance |
| **Symptoms** | Log symptom, severity, body part, date, and notes |
| **Medications** | Track dosage, frequency, dates, and adherence |
| **Lifestyle** | Log sleep, mood, stress, and nutrition day-to-day |
| **Lab reports** | Upload a PDF; Gemini extracts test values, ranges, flags, and a summary |
| **AI insights** | Gemini reviews your combined data for trends, correlations, and gaps |
| **Doctor summary** | One-click structured report to bring to an appointment |

Everything is scoped per user via JWT authentication — no one sees another user's data.

---

## How it works

```text
React (Vite)  ⇄  Django REST API  ⇄  SQLite
                        │
                        ▼
                 Google Gemini API
                        ▲
                        │
              PDF lab reports (pypdf)
```

1. The React frontend calls the Django backend over REST.
2. Django stores structured health data in SQLite.
3. When you request insights or upload a lab report, Django assembles a prompt and sends it to Gemini.
4. Gemini's structured response (JSON) is stored and rendered back in the UI.

---

## Tech stack

- **Frontend:** React, Vite, Recharts, Framer Motion
- **Backend:** Django, Django REST Framework, SimpleJWT
- **Database:** SQLite
- **AI:** Google Gemini API + `pypdf` for PDF text extraction

---

## Running it locally

**Requirements:** Python 3.10+, Node.js 18+, a Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

**1. Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env`:
```env
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
GEMINI_API_KEY=your-gemini-api-key
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Then:
```bash
python manage.py migrate
python manage.py runserver
```
Backend runs at `http://127.0.0.1:8000/`.

**2. Frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173/`.

---

## Key API endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/register/`, `/login/` | Auth |
| `GET/POST /api/health/symptoms/`, `/medications/`, `/lifestyle/`, `/labs/` | CRUD for health data |
| `POST /api/health/labs/<id>/analyze/` | Analyze an uploaded lab report |
| `GET /api/health/dashboard/` | Dashboard stats |
| `GET /api/health/doctor-summary/` | Generate doctor summary |
| `POST /api/ai/insights/` | Generate AI health insights |

---

## Limitations

- AI output can be incomplete or wrong — always double-check with a professional.
- Lab report extraction needs machine-readable PDF text (scanned images won't work yet).
- Insight quality depends on how much data you've logged.

---

## Roadmap

- [ ] PostgreSQL + cloud storage for production
- [ ] OCR for scanned lab reports
- [ ] Medication reminders
- [ ] Exportable doctor reports
- [ ] Automated tests + CI/CD

---

## License

Educational / portfolio use only.

# MedLog AI 🩺

MedLog AI is a full-stack health tracking app. Users log symptoms, medications, lifestyle habits, and lab reports in one place, and **Google Gemini AI** turns that data into plain-language summaries, patterns, and questions worth raising with a doctor.

> **Disclaimer:** This is an informational tool, not a diagnostic one. AI output should always be reviewed by a healthcare professional.

---

## What it does

| Area | What you can do |
|---|---|
| **Dashboard** | See symptom counts, active medications, and severity trends at a glance |
| **Symptoms** | Log symptom, severity, body part, date, and notes |
| **Medications** | Track dosage, frequency, dates, and adherence |
| **Lifestyle** | Log sleep, mood, stress, and nutrition day-to-day |
| **Lab reports** | Upload a PDF; Gemini extracts test values, ranges, flags, and a summary |
| **AI insights** | Gemini reviews your combined data for trends, correlations, and gaps |
| **Doctor summary** | One-click structured report to bring to an appointment |

Everything is scoped per user via JWT authentication — no one sees another user's data.

---

## How it works

```text
React (Vite)  ⇄  Django REST API  ⇄  SQLite
                        │
                        ▼
                 Google Gemini API
                        ▲
                        │
              PDF lab reports (pypdf)
```

1. The React frontend calls the Django backend over REST.
2. Django stores structured health data in SQLite.
3. When you request insights or upload a lab report, Django assembles a prompt and sends it to Gemini.
4. Gemini's structured response (JSON) is stored and rendered back in the UI.

---

## Tech stack

- **Frontend:** React, Vite, Recharts, Framer Motion
- **Backend:** Django, Django REST Framework, SimpleJWT
- **Database:** SQLite
- **AI:** Google Gemini API + `pypdf` for PDF text extraction

---

## Running it locally

**Requirements:** Python 3.10+, Node.js 18+, a Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

**1. Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env`:
```env
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
GEMINI_API_KEY=your-gemini-api-key
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Then:
```bash
python manage.py migrate
python manage.py runserver
```
Backend runs at `http://127.0.0.1:8000/`.

**2. Frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173/`.

---

## Key API endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/register/`, `/login/` | Auth |
| `GET/POST /api/health/symptoms/`, `/medications/`, `/lifestyle/`, `/labs/` | CRUD for health data |
| `POST /api/health/labs/<id>/analyze/` | Analyze an uploaded lab report |
| `GET /api/health/dashboard/` | Dashboard stats |
| `GET /api/health/doctor-summary/` | Generate doctor summary |
| `POST /api/ai/insights/` | Generate AI health insights |

---

## Limitations

- AI output can be incomplete or wrong — always double-check with a professional.
- Lab report extraction needs machine-readable PDF text (scanned images won't work yet).
- Insight quality depends on how much data you've logged.

---

## Roadmap

- [ ] PostgreSQL + cloud storage for production
- [ ] OCR for scanned lab reports
- [ ] Medication reminders
- [ ] Exportable doctor reports
- [ ] Automated tests + CI/CD

---

## License

Educational / portfolio use only.
