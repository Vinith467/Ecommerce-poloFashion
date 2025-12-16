from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = (
        ('shirt', 'Shirt'),
        ('pant', 'Pant'),
        ('traditional', 'Traditional'),
    )

    TYPE_CHOICES = (
        ('custom', 'Custom'),
        ('readymade', 'Ready-made'),
    )

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    description = models.TextField()
    image = models.ImageField(upload_to='products/', blank=True, null=True)

    brand = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    sizes = models.JSONField(blank=True, null=True)

    # ✅ WHAT'S INSIDE THE BOX
    box_items = models.JSONField(
        blank=True,
        null=True,
        help_text="Example: ['Shirt fabric', 'Dhoti', 'Angavastram']"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="products/")

    def __str__(self):
        return f"{self.product.name} Image"
    
class RentalItem(models.Model):
    name = models.CharField(max_length=200)

    sizes = models.JSONField(   # 👈 multiple sizes supported
        help_text="Example: ['S','M','L','XL']"
    )

    color = models.CharField(max_length=50)

    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2)

    buy_price = models.DecimalField(   # 👈 BUY option
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    image = models.ImageField(upload_to="rentals/")
    description = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class RentalImage(models.Model):
    rental_item = models.ForeignKey(
        RentalItem,
        related_name="images",
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="rentals/")

    def __str__(self):
        return f"{self.rental_item.name} Image"


class Accessory(models.Model):
    CATEGORY_CHOICES = (
        ("belt", "Belt"),
        ("tie", "Tie"),
        ("wallet", "Wallet"),
        ("socks", "Socks"),
        ("cufflink", "Cufflink"),
        ("other", "Other"),
    )

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="accessories/")
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Innerwear(models.Model):
    name = models.CharField(max_length=200)
    sizes = models.JSONField(null=True, blank=True)  # ["S","M","L","XL"]
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="innerwear/")
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Fabric(models.Model):
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=100)  # Cotton, Linen, Silk, etc.
    color = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(max_length=500)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.color}"

    class Meta:
        ordering = ['name']