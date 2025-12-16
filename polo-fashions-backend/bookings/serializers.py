from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    user = serializers.IntegerField(source='user.id', read_only=True)

    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'user', 'customer_name', 'email', 'user_name', 'phone', 'date', 'time', 'status', 'notes', 'created_at', 'updated_at']  # ✅ Added 'user_name'
        read_only_fields = ['id', 'user', 'customer_name', 'email', 'user_name', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
            validated_data['customer_name'] = request.user.get_full_name() or request.user.username
            validated_data['email'] = request.user.email
        return super().create(validated_data)