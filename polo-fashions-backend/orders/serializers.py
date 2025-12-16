# orders/serializers.py
from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    product_details = serializers.SerializerMethodField()
    fabric_details = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'customer_name', 'user_name',
            'product', 'product_name', 
            'fabric', 'fabric_name', 'fabric_price_per_meter',
            'stitch_type', 'meters', 'stitching_charge',
            'size', 'quantity', 'total_price', 'status',
            'rental_days', 'rental_deposit', 'rental_price_per_day',
            'order_date', 'notes', 'product_details', 'fabric_details',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'customer_name', 'user_name',
            'status', 'order_date', 'product_details', 'fabric_details',
            'created_at', 'updated_at'
        ]

    def get_product_details(self, obj):
        if obj.product:
            return {
                'id': obj.product.id,
                'name': obj.product.name,
                'category': getattr(obj.product, 'category', None),
                'image': obj.product.image.url if obj.product.image else None,
            }
        return None

    def get_fabric_details(self, obj):
        if obj.fabric:
            return {
                'id': obj.fabric.id,
                'name': obj.fabric.name,
                'color': getattr(obj.fabric, 'color', None),
                'price': str(obj.fabric.price),
            }
        return None

    def create(self, validated_data):
        print("Creating...")
        request = self.context.get('request')
        print(f"Request created by user : {request.user.username}")
        print(f"Data : \n\t{validated_data}")
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
            validated_data['customer_name'] = request.user.get_full_name() or request.user.username
        print("Order created")
        return super().create(validated_data)
