import json
import os
from google import genai
from .prompts import HEALTH_INSIGHTS_PROMPT, LAB_ANALYSIS_PROMPT, DOCTOR_SUMMARY_PROMPT

def ask_gemini(prompt):
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise RuntimeError("GEMINI_API_KEY is not configured.")
    client = genai.Client(api_key=key)
    response = client.models.generate_content(
        model="gemini-flash-lite-latest",
        contents=prompt,
    )
    return response.text

def _json_or_fallback(text, fallback):
    try:
        return json.loads(text)
    except Exception:
        return fallback(text)

def analyze_health(data):
    text = ask_gemini(HEALTH_INSIGHTS_PROMPT.format(data=json.dumps(data, default=str)))
    return _json_or_fallback(text, lambda x: {
        "summary": x, "trends": [], "correlations": [],
        "questions_for_doctor": [],
        "safety_notes": ["AI output is informational and should be reviewed with a clinician."]
    })

def analyze_lab(text):
    raw = ask_gemini(LAB_ANALYSIS_PROMPT.format(text=text[:30000]))
    return _json_or_fallback(raw, lambda x: {
        "summary": x, "tests": [], "questions_for_doctor": []
    })

def generate_doctor_summary(data):
    text = ask_gemini(
        DOCTOR_SUMMARY_PROMPT.format(
            data=json.dumps(data, default=str)
        )
    )

    return _json_or_fallback(
        text,
        lambda x: {
            "patient_overview": x,
            "current_symptoms": [],
            "medications": [],
            "lifestyle": [],
            "lab_reports": [],
            "observed_patterns": [],
            "points_to_discuss": [],
            "clinical_notes": [
                "This summary is generated from user-entered tracking data and should be reviewed with a qualified healthcare professional."
            ]
        }
    )
