from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, login_view

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", login_view),
    path("token/refresh/", TokenRefreshView.as_view()),
]