from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, FabricViewSet, RentalItemViewSet, AccessoryViewSet, InnerwearViewSet


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'fabrics', FabricViewSet, basename='fabric')
router.register(r"rentals", RentalItemViewSet)
router.register(r"accessories", AccessoryViewSet)
router.register(r"innerwear", InnerwearViewSet)


urlpatterns = [
    path('', include(router.urls)),
]