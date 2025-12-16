from django.core.management.base import BaseCommand
from products.models import Product, Fabric

class Command(BaseCommand):
    help = 'Populate database with sample products and fabrics'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample products...')
        
        # Create Products
        products_data = [
            {
                'name': 'Formal Shirt',
                'category': 'shirt',
                'type': 'custom',
                'description': 'Custom tailored formal shirt with premium fabrics',
                'image': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
            },
            {
                'name': 'Casual Shirt',
                'category': 'shirt',
                'type': 'custom',
                'description': 'Comfortable custom casual shirt for everyday wear',
                'image': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
            },
            {
                'name': 'Business Shirt',
                'category': 'shirt',
                'type': 'custom',
                'description': 'Professional business shirt tailored to perfection',
                'image': 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400',
            },
            {
                'name': 'Formal Pant',
                'category': 'pant',
                'type': 'custom',
                'description': 'Custom tailored formal pants for the perfect fit',
                'image': 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
            },
            {
                'name': 'Casual Pant',
                'category': 'pant',
                'type': 'custom',
                'description': 'Comfortable casual pants made to measure',
                'image': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
            },
            {
                'name': 'Ramraj Dhoti',
                'category': 'traditional',
                'type': 'readymade',
                'description': 'Premium quality traditional dhoti from Ramraj',
                'image': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
                'brand': 'Ramraj',
                'price': 899,
                'sizes': ['S', 'M', 'L', 'XL', 'XXL'],
            },
            {
                'name': 'DSP Kurta',
                'category': 'traditional',
                'type': 'readymade',
                'description': 'Elegant kurta from DSP for special occasions',
                'image': 'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=400',
                'brand': 'DSP',
                'price': 1299,
                'sizes': ['M', 'L', 'XL', 'XXL'],
            },
            {
                'name': 'Pothys Silk Veshti',
                'category': 'traditional',
                'type': 'readymade',
                'description': 'Traditional silk veshti from Pothys',
                'image': 'https://images.unsplash.com/photo-1610652492500-96ffbde4ec8e?w=400',
                'brand': 'Pothys',
                'price': 1599,
                'sizes': ['Free Size'],
            },
        ]

        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created product: {product.name}'))
            else:
                self.stdout.write(f'- Product already exists: {product.name}')

        # Create Fabrics
        self.stdout.write('\nCreating sample fabrics...')
        
        fabrics_data = [
            {
                'name': 'Premium Cotton',
                'type': 'Cotton',
                'color': 'White',
                'price': 599,
                'image': 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300',
                'description': 'Breathable and comfortable premium cotton',
            },
            {
                'name': 'Linen Blend',
                'type': 'Linen',
                'color': 'Light Blue',
                'price': 799,
                'image': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300',
                'description': 'Elegant linen blend for formal occasions',
            },
            {
                'name': 'Silk Blend',
                'type': 'Silk',
                'color': 'Black',
                'price': 999,
                'image': 'https://images.unsplash.com/photo-1601924357840-3c6726fa46de?w=300',
                'description': 'Luxurious silk blend fabric',
            },
            {
                'name': 'Cotton Twill',
                'type': 'Cotton',
                'color': 'Navy Blue',
                'price': 699,
                'image': 'https://images.unsplash.com/photo-1519488080922-d91aecb6caea?w=300',
                'description': 'Durable cotton twill for casual wear',
            },
            {
                'name': 'Denim Fabric',
                'type': 'Denim',
                'color': 'Dark Blue',
                'price': 899,
                'image': 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300',
                'description': 'Premium denim for pants',
            },
            {
                'name': 'Khaki Cotton',
                'type': 'Cotton',
                'color': 'Khaki',
                'price': 649,
                'image': 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=300',
                'description': 'Classic khaki cotton fabric',
            },
        ]

        for fabric_data in fabrics_data:
            fabric, created = Fabric.objects.get_or_create(
                name=fabric_data['name'],
                defaults=fabric_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created fabric: {fabric.name}'))
            else:
                self.stdout.write(f'- Fabric already exists: {fabric.name}')

        self.stdout.write(self.style.SUCCESS('\n✅ Database population complete!'))