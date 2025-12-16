from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Product, Fabric,RentalItem, Accessory, Innerwear
from .serializers import ProductSerializer, FabricSerializer , RentalItemSerializer, AccessorySerializer, InnerwearSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RentalItemViewSet(viewsets.ModelViewSet):
    queryset = RentalItem.objects.filter(is_active=True)
    serializer_class = RentalItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
class AccessoryViewSet(viewsets.ModelViewSet):
    queryset = Accessory.objects.filter(is_active=True)
    serializer_class = AccessorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
class InnerwearViewSet(viewsets.ModelViewSet):
    queryset = Innerwear.objects.filter(is_active=True)
    serializer_class = InnerwearSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class FabricViewSet(viewsets.ModelViewSet):
    queryset = Fabric.objects.filter(is_active=True)
    serializer_class = FabricSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]