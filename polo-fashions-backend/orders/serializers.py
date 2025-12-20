from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    product_details = serializers.SerializerMethodField()
    fabric_details = serializers.SerializerMethodField()
    rental_item_details = serializers.SerializerMethodField()  # ✅ ADD
    product_type = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'customer_name', 'user_name',
            'product', 'rental_item',  # ✅ ADD rental_item
            'product_type', 'product_name', 
            'fabric', 'fabric_name', 'fabric_price_per_meter',
            'stitch_type', 'meters', 'stitching_charge',
            'size', 'quantity', 'total_price', 'status',
            'rental_days', 'rental_deposit', 'rental_price_per_day',
            'order_date', 'notes', 
            'product_details', 'fabric_details', 'rental_item_details',  # ✅ ADD
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'customer_name', 'user_name',
            'status', 'order_date', 'product_details',
            'product_name', 'product_type',
            'fabric_details', 'rental_item_details',  # ✅ ADD
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
                 # ✅ ADD IMAGE FROM FABRIC
                'image': obj.fabric.image.url if hasattr(obj.fabric, 'image') and obj.fabric.image else None,
            }
                
            
        return None

    # ✅ ADD THIS METHOD
    def get_rental_item_details(self, obj):
        """Get rental item details with images"""
        if obj.rental_item:
            images = []
            if hasattr(obj.rental_item, 'images'):
                images = [
                    {'id': img.id, 'image': img.image.url if img.image else None}
                    for img in obj.rental_item.images.all()
                ]
            
            return {
                'id': obj.rental_item.id,
                'name': obj.rental_item.name,
                'color': obj.rental_item.color,
                'image': obj.rental_item.image.url if obj.rental_item.image else None,
                'images': images,
                'sizes': obj.rental_item.sizes,
            }
        return None

    def get_product_type(self, obj):
        # ✅ CHECK RENTAL FIRST
        if obj.rental_item or (obj.rental_days and obj.rental_days > 0):
            return "rental"

        if obj.stitch_type and obj.meters and float(obj.meters) > 0:
            return "custom"

        if obj.meters and float(obj.meters) > 0:
            return "fabric"

        if obj.product and getattr(obj.product, "category", None) == "traditional":
            return "traditional"

        if obj.product:
            return "ready-made"

        return "other"

    def create(self, validated_data):
        request = self.context.get("request")

        if request and hasattr(request, "user"):
            validated_data["user"] = request.user
            validated_data["customer_name"] = (
                request.user.get_full_name() or request.user.username
            )

        # ✅ HANDLE PRODUCT NAME FROM ALL SOURCES
        if validated_data.get("fabric"):
            validated_data["product_name"] = validated_data["fabric"].name
            validated_data["fabric_name"] = validated_data["fabric"].name
        elif validated_data.get("rental_item"):
            validated_data["product_name"] = validated_data["rental_item"].name
        elif validated_data.get("product"):
            validated_data["product_name"] = validated_data["product"].name

        return super().create(validated_data)

    def to_representation(self, instance):
        """Ensure product_name is always current"""
        data = super().to_representation(instance)
        
        # ✅ Update product_name from the actual source (PRIORITY ORDER)
        if instance.fabric:
            data['product_name'] = instance.fabric.name
        elif instance.rental_item:
            data['product_name'] = instance.rental_item.name
        elif instance.product:
            data['product_name'] = instance.product.name
        
        return data