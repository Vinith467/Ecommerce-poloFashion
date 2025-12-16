from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'email', 'date', 'time', 'status', 'created_at']
    list_filter = ['status', 'date']
    search_fields = ['customer_name', 'email', 'phone']