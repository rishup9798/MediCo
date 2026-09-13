from django.conf import settings
from django.db import models
class Symptom(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="symptoms")
    date=models.DateField(); name=models.CharField(max_length=120); severity=models.PositiveSmallIntegerField()
    body_part=models.CharField(max_length=120,blank=True); notes=models.TextField(blank=True); created_at=models.DateTimeField(auto_now_add=True)
    class Meta: ordering=["-date","-created_at"]
class Medication(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="medications")
    name=models.CharField(max_length=150); dosage=models.CharField(max_length=100,blank=True); frequency=models.CharField(max_length=100,blank=True)
    start_date=models.DateField(); end_date=models.DateField(null=True,blank=True); adherence=models.PositiveSmallIntegerField(default=0)
    active=models.BooleanField(default=True); notes=models.TextField(blank=True); created_at=models.DateTimeField(auto_now_add=True)
    class Meta: ordering=["-active","name"]
class Lifestyle(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="lifestyle")
    date=models.DateField(); sleep_hours=models.DecimalField(max_digits=4,decimal_places=1,null=True,blank=True)
    mood=models.PositiveSmallIntegerField(null=True,blank=True); stress=models.PositiveSmallIntegerField(null=True,blank=True)
    nutrition=models.PositiveSmallIntegerField(null=True,blank=True); notes=models.TextField(blank=True); created_at=models.DateTimeField(auto_now_add=True)
    class Meta: ordering=["-date","-created_at"]
class LabReport(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="labs")
    title=models.CharField(max_length=200); report_date=models.DateField(); file=models.FileField(upload_to="labs/")
    extracted_text=models.TextField(blank=True); analysis=models.JSONField(default=dict,blank=True); uploaded_at=models.DateTimeField(auto_now_add=True)
    class Meta: ordering=["-report_date","-uploaded_at"]
