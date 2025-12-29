from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .utils import get_valid_next_statuses

# orders/views.py
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=["patch"], url_path="update-status")
    def update_status(self, request, pk=None):
        if not request.user.role == "admin":
            return Response(
                 {"error": "Only admin can update order status"},
                 status=status.HTTP_403_FORBIDDEN
            )

        order = self.get_object()
        new_status = request.data.get("status")

        if not new_status:
            return Response(
                {"error": "Status is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        allowed_next = get_valid_next_statuses(order)

        # 🚫 Rental-only protection
        if new_status in ["returned", "deposit_refunded"] and order.rental_days == 0:
            return Response(
                {"error": "This status is only allowed for rental orders"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🚫 Invalid transition protection
        if new_status not in allowed_next:
            return Response(
                {
                    "error": f"Invalid status transition from '{order.status}' to '{new_status}'",
                    "allowed_statuses": allowed_next,
                    "order_type": order.order_type,
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save(update_fields=["status", "updated_at"])

        return Response(
            {
                "success": True,
                "order_id": order.id,
                "new_status": new_status,
                "next_allowed_statuses": get_valid_next_statuses(order)

            },
            status=status.HTTP_200_OK
        )


    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    

