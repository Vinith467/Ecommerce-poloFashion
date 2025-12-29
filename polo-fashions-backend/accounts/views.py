from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import UserSerializer, RegisterSerializer, UpdateMeasurementSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        return User.objects.filter(id=user.id)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser],
    parser_classes=[MultiPartParser, FormParser],)
    def update_measurement(self, request, pk=None):
        user = self.get_object()
        serializer = UpdateMeasurementSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                "success": True,
                "measurement_photo": user.measurement_photo.url if user.measurement_photo else None,
                "measurement_status": user.measurement_status,
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)