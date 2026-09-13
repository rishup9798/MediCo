from django.contrib import admin
from .models import Symptom,Medication,Lifestyle,LabReport
admin.site.register([Symptom,Medication,Lifestyle,LabReport])
