from rest_framework import serializers
from .models import Product, Fabric , ProductImage , RentalItem, Accessory, Innerwear , RentalImage
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image"]

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

class RentalImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalImage
        fields = ["id", "image"]

class RentalItemSerializer(serializers.ModelSerializer):
    images = RentalImageSerializer(many=True, read_only=True)

    class Meta:
        model = RentalItem
        fields = "__all__"

class AccessorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Accessory
        fields = "__all__"
class InnerwearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Innerwear
        fields = "__all__"

class FabricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fabric
        fields = '__all__'
        