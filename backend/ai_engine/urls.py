from django.urls import path
from .views import insights

urlpatterns = [path("insights/", insights)]
