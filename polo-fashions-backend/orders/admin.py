# orders/admin.py
from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer_name', 'total_price', 'status', 'order_date']
    list_filter = ['status']
    search_fields = ['customer_name', 'product_name']
