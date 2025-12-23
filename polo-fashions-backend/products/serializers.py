from rest_framework import serializers
from .models import Product, Fabric, ProductImage, RentalItem, Accessory, Innerwear, RentalImage


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    def get_image(self, obj):
        """Return full Cloudinary URL"""
        if obj.image:
            return obj.image.url  # ✅ This returns full URL
        return None
    
    class Meta:
        model = ProductImage
        fields = ["id", "image"]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()
    
    def get_image(self, obj):
        """Return full Cloudinary URL for main image"""
        if obj.image:
            return obj.image.url
        return None
    
    class Meta:
        model = Product
        fields = '__all__'


class RentalImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    def get_image(self, obj):
        """Return full Cloudinary URL"""
        if obj.image:
            return obj.image.url
        return None
    
    class Meta:
        model = RentalImage
        fields = ["id", "image"]


class RentalItemSerializer(serializers.ModelSerializer):
    images = RentalImageSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()
    
    def get_image(self, obj):
        """Return full Cloudinary URL for main image"""
        if obj.image:
            return obj.image.url
        return None

    class Meta:
        model = RentalItem
        fields = "__all__"


class AccessorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    def get_image(self, obj):
        """Return full Cloudinary URL"""
        if obj.image:
            return obj.image.url
        return None
    
    class Meta:
        model = Accessory
        fields = "__all__"


class InnerwearSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    def get_image(self, obj):
        """Return full Cloudinary URL"""
        if obj.image:
            return obj.image.url
        return None
    
    class Meta:
        model = Innerwear
        fields = "__all__"


class FabricSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    def get_image(self, obj):
        """Return full Cloudinary URL"""
        if obj.image:
            return obj.image.url
        return None
    
    class Meta:
        model = Fabric
        fields = '__all__'