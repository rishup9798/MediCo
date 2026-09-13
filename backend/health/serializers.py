from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Symptom,Medication,Lifestyle,LabReport
class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True,min_length=6)
    class Meta: model=User; fields=["id","username","email","password"]
    def create(self,validated_data): return User.objects.create_user(**validated_data)
class SymptomSerializer(serializers.ModelSerializer):
    class Meta: model=Symptom; fields="__all__"; read_only_fields=["user","created_at"]
class MedicationSerializer(serializers.ModelSerializer):
    class Meta: model=Medication; fields="__all__"; read_only_fields=["user","created_at"]
class LifestyleSerializer(serializers.ModelSerializer):
    class Meta: model=Lifestyle; fields="__all__"; read_only_fields=["user","created_at"]
class LabReportSerializer(serializers.ModelSerializer):
    class Meta:
        model=LabReport; fields=["id","title","report_date","file","extracted_text","analysis","uploaded_at"]
        read_only_fields=["extracted_text","analysis","uploaded_at"]
