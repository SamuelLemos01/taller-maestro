from rest_framework import serializers
from .models import ShoppingCart, ShoppingCartItem
from products.models import Product
from products.serializers import ProductSerializer


class ShoppingCartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = ShoppingCartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_subtotal(self, obj):
        return obj.product.price * obj.quantity


class ShoppingCartSerializer(serializers.ModelSerializer):
    items = ShoppingCartItemSerializer(source='shoppingcartitem_set', many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = ShoppingCart
        fields = ['id', 'user', 'items', 'total_items', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_total_items(self, obj):
        return obj.shoppingcartitem_set.count()

    def get_total_price(self, obj):
        return sum(item.product.price * item.quantity for item in obj.shoppingcartitem_set.all())


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate_product_id(self, value):
        try:
            Product.objects.get(id=value)
        except Product.DoesNotExist:
            raise serializers.ValidationError("El producto no existe.")
        return value


class UpdateQuantitySerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=0) 