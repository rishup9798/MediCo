from rest_framework.decorators import api_view
from rest_framework.response import Response
from health.views import health_payload
from .analyzer import analyze_health

@api_view(["POST"])
def insights(request):
    try:
        return Response(analyze_health(health_payload(request.user)))
    except Exception as exc:
        return Response({"detail": str(exc)}, status=503)
