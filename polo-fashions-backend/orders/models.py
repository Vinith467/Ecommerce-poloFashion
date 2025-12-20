# orders/models.py
from django.db import models
from django.conf import settings
from products.models import Product, Fabric
from decimal import Decimal


class Order(models.Model):
    STATUS_CHOICES = (
        ('placed', 'Placed'),
        ('processing', 'Processing'),
        ('stitching', 'Stitching'),
        ('buttoning', 'Buttoning'),
        ('ironing', 'Ironing'),
        ('ready_for_pickup', 'Ready for Pickup'),
        ('picked_up', 'Picked Up'),
        ('returned', 'Returned'),                 # Rental only
        ('deposit_refunded', 'Deposit Refunded'), # Rental only
        ('cancelled', 'Cancelled'),
    )

    STITCH_CHOICES = (
        ('shirt', 'Shirt'),
        ('pant', 'Pant'),
        ('kurta', 'Kurta'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    customer_name = models.CharField(max_length=200)

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=200)

    # ===============================
    # Fabric / Custom fields
    # ===============================
    fabric = models.ForeignKey(
        Fabric,
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    fabric_name = models.CharField(max_length=200, blank=True, null=True)
    fabric_price_per_meter = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )

    stitch_type = models.CharField(
        max_length=20,
        choices=STITCH_CHOICES,
        blank=True,
        null=True
    )
    meters = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00')
    )
    stitching_charge = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )

    # ===============================
    # Ready-made
    # ===============================
    size = models.CharField(max_length=10, blank=True, null=True)

    # ===============================
    # Rental fields
    # ===============================
    rental_days = models.PositiveIntegerField(default=0)
    rental_deposit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    rental_price_per_day = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )

    # ===============================
    # Order summary
    # ===============================
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='placed'
    )

    order_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"

    class Meta:
        ordering = ['-created_at']
        
