from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    SymptomViewSet, MedicationViewSet, LifestyleViewSet,
    LabReportViewSet, dashboard, doctor_summary
)

router = DefaultRouter()
router.register("symptoms", SymptomViewSet, basename="symptoms")
router.register("medications", MedicationViewSet, basename="medications")
router.register("lifestyle", LifestyleViewSet, basename="lifestyle")
router.register("labs", LabReportViewSet, basename="labs")

urlpatterns = [
    path("dashboard/", dashboard),
    path("doctor-summary/", doctor_summary),
    path("", __import__("django.urls", fromlist=["include"]).include(router.urls)),
]
