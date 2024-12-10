from rest_framework import serializers
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'sales']

    def validate_sales(self, value):
        """
        Convert the sales value from a string to a float and validate it.
        """
        try:
            # Convert sales value from string to float
            value = float(value)
        except ValueError:
            raise serializers.ValidationError("Sales value must be a valid number.")

        # Ensure sales value is non-negative
        if value < 0:
            raise serializers.ValidationError("Sales value cannot be negative.")

        return value
