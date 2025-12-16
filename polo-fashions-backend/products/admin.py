from django.contrib import admin
from .models import Product, Fabric, ProductImage , RentalImage
from .models import RentalItem, Accessory, Innerwear 

admin.site.register(Accessory)
admin.site.register(Innerwear)

class RentalImageInline(admin.TabularInline):
    model = RentalImage
    extra = 3

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = ['name', 'category', 'type', 'brand', 'price', 'is_active']
    list_filter = ['category', 'type', 'is_active']
    search_fields = ['name', 'brand']
    fieldsets = (
        ("Basic Info", {
            "fields": (
                "name",
                "category",
                "type",
                "brand",
                "price",
                "description",
                "is_active",
            )
        }),
        ("Sizes & Box Details", {
            "fields": (
                "sizes",
                "box_items",
            ),
        }),
    )

@admin.register(Fabric)
class FabricAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'color', 'price', 'is_active']
    list_filter = ['type', 'is_active']
    search_fields = ['name', 'color']
    
@admin.register(RentalItem)
class RentalItemAdmin(admin.ModelAdmin):
    inlines = [RentalImageInline]
    list_display = ["name", "price_per_day", "deposit_amount", "is_active"]
