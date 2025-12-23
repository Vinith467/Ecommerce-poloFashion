from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    measurement_photo = serializers.SerializerMethodField()
    
    def get_measurement_photo(self, obj):
        """Return full Cloudinary URL for measurement photo"""
        if obj.measurement_photo:
            return obj.measurement_photo.url  # ✅ Full URL
        return None
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'role',
            'measurement_status',
            'measurement_photo',
            'created_at',
            'is_staff',
            'is_superuser',
        ]
        read_only_fields = ['id', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'phone']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role='customer'
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UpdateMeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['measurement_photo', 'measurement_status']

    def update(self, instance, validated_data):
        instance.measurement_photo = validated_data.get('measurement_photo', instance.measurement_photo)
        instance.measurement_status = 'completed'
        instance.save()
        return instance