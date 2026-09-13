from datetime import date
from django.contrib.auth.models import User
from django.db.models import Avg
from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from pypdf import PdfReader

from .models import Symptom, Medication, Lifestyle, LabReport
from .serializers import SymptomSerializer, MedicationSerializer, LifestyleSerializer, LabReportSerializer
from ai_engine.analyzer import analyze_health, analyze_lab, generate_doctor_summary

class OwnedViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SymptomViewSet(OwnedViewSet):
    queryset = Symptom.objects.all()
    serializer_class = SymptomSerializer

class MedicationViewSet(OwnedViewSet):
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer

class LifestyleViewSet(OwnedViewSet):
    queryset = Lifestyle.objects.all()
    serializer_class = LifestyleSerializer

class LabReportViewSet(OwnedViewSet):
    queryset = LabReport.objects.all()
    serializer_class = LabReportSerializer

    @action(detail=True, methods=["post"])
    def analyze(self, request, pk=None):
        lab = self.get_object()
        try:
            text = "\n".join(
                page.extract_text() or "" for page in PdfReader(lab.file.path).pages
            )[:50000]
            lab.extracted_text = text
            lab.analysis = analyze_lab(text) if text.strip() else {
                "summary": "No extractable text was found in this PDF.",
                "tests": [], "questions_for_doctor": []
            }
            lab.save()
            return Response(LabReportSerializer(lab).data)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=400)

def health_payload(user):
    return {
        "symptoms": list(Symptom.objects.filter(user=user).values(
            "date", "name", "severity", "body_part", "notes"
        )[:100]),
        "medications": list(Medication.objects.filter(user=user).values(
            "name", "dosage", "frequency", "start_date",
            "end_date", "adherence", "active"
        )),
        "lifestyle": list(Lifestyle.objects.filter(user=user).values(
            "date", "sleep_hours", "mood", "stress", "nutrition", "notes"
        )[:100]),
        "labs": list(LabReport.objects.filter(user=user).values(
            "title", "report_date", "analysis"
        )[:20]),
    }

@api_view(["GET"])
def dashboard(request):
    symptoms = Symptom.objects.filter(user=request.user)
    meds = Medication.objects.filter(user=request.user)
    lifestyle = Lifestyle.objects.filter(user=request.user)
    labs = LabReport.objects.filter(user=request.user)

    return Response({
        "counts": {
            "symptoms": symptoms.count(),
            "active_medications": meds.filter(active=True).count(),
            "lifestyle_entries": lifestyle.count(),
            "lab_reports": labs.count(),
        },
        "severity_average": round(symptoms.aggregate(v=Avg("severity"))["v"] or 0, 1),
        "symptom_trend": list(
            symptoms.values("date").annotate(value=Avg("severity")).order_by("date")
        ),
        "recent_symptoms": SymptomSerializer(symptoms[:5], many=True).data,
        "active_medications": MedicationSerializer(
            meds.filter(active=True), many=True
        ).data,
    })

@api_view(["POST"])
def ai_insights(request):
    try:
        return Response(analyze_health(health_payload(request.user)))
    except Exception as exc:
        return Response({"detail": str(exc)}, status=503)

@api_view(["GET"])
def doctor_summary(request):
    try:
        return Response({
            "generated": generate_doctor_summary(
                health_payload(request.user)
            ),
            "generated_at": date.today(),
        })
    except Exception as exc:
        return Response({"detail": str(exc)}, status=503)