# MedLog AI 🩺
Full-stack health tracking app using React/Vite + Django REST + SQLite + Gemini.

## Features
- JWT authentication
- Symptom logging with severity/body part
- Medication and adherence tracking
- Sleep, mood, stress and nutrition check-ins
- PDF lab-report upload and text extraction
- Gemini-powered lab analysis and health-pattern insights
- Doctor-summary generation
- Dashboard charts with Recharts
- User-scoped API data

## Run
### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

Put your Gemini key in `backend/.env`:
`GEMINI_API_KEY=...`

AI features are optional; the tracker works without a key.
