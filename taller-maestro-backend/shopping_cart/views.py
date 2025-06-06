from django.shortcuts import render, get_object_or_404
from .models import ShoppingCart, ShoppingCartItem
from products.models import Product
from .serializers import (
    ShoppingCartSerializer, 
    ShoppingCartItemSerializer, 
    AddToCartSerializer, 
    UpdateQuantitySerializer
)
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction

# Create your views here.

class ShoppingCartViewSet(viewsets.ModelViewSet):
    serializer_class = ShoppingCartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Devuelve el carrito del usuario autenticado
        return ShoppingCart.objects.filter(user=self.request.user)

    def get_or_create_cart(self):
        #Obtiene o crea el carrito del usuario
        cart, created = ShoppingCart.objects.get_or_create(user=self.request.user)
        return cart

    def list(self, request):
        #Obtiene el carrito del usuario con todos sus items
        cart = self.get_or_create_cart()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        #Agrega un producto al carrito o aumenta su cantidad si ya existe
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            product_id = serializer.validated_data['product_id']
            quantity = serializer.validated_data['quantity']
            
            try:
                product = Product.objects.get(id=product_id)
                
                # Verificar stock disponible
                if product.stock < quantity:
                    return Response(
                        {"error": f"Stock insuficiente. Solo quedan {product.stock} unidades disponibles."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                cart = self.get_or_create_cart()
                
                # Verificar si el producto ya está en el carrito
                cart_item, created = ShoppingCartItem.objects.get_or_create(
                    shopping_cart=cart,
                    product=product,
                    defaults={'quantity': quantity}
                )
                
                if not created:
                    # Si ya existe, aumentar la cantidad
                    new_quantity = cart_item.quantity + quantity
                    if product.stock < new_quantity:
                        return Response(
                            {"error": f"Stock insuficiente. Solo quedan {product.stock} unidades disponibles."}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    cart_item.quantity = new_quantity
                    cart_item.save()
                
                # Devolver el carrito actualizado
                cart_serializer = ShoppingCartSerializer(cart)
                return Response(cart_serializer.data, status=status.HTTP_201_CREATED)
                
            except Product.DoesNotExist:
                return Response(
                    {"error": "El producto no existe."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        #Elimina un producto del carrito completamente
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response(
                {"error": "Se requiere product_id."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = self.get_or_create_cart()
            cart_item = ShoppingCartItem.objects.get(
                shopping_cart=cart,
                product_id=product_id
            )
            cart_item.delete()
            
            # Devolver el carrito actualizado
            cart_serializer = ShoppingCartSerializer(cart)
            return Response(cart_serializer.data, status=status.HTTP_200_OK)
            
        except ShoppingCartItem.DoesNotExist:
            return Response(
                {"error": "El producto no está en el carrito."}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        #Actualiza la cantidad de un producto en el carrito
        product_id = request.data.get('product_id')
        quantity_serializer = UpdateQuantitySerializer(data=request.data)
        
        if not product_id:
            return Response(
                {"error": "Se requiere product_id."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if quantity_serializer.is_valid():
            quantity = quantity_serializer.validated_data['quantity']
            
            try:
                cart = self.get_or_create_cart()
                cart_item = ShoppingCartItem.objects.get(
                    shopping_cart=cart,
                    product_id=product_id
                )
                
                # Si la cantidad es 0, eliminar el item
                if quantity == 0:
                    cart_item.delete()
                else:
                    # Verificar stock disponible
                    if cart_item.product.stock < quantity:
                        return Response(
                            {"error": f"Stock insuficiente. Solo quedan {cart_item.product.stock} unidades disponibles."}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    cart_item.quantity = quantity
                    cart_item.save()
                
                # Devolver el carrito actualizado
                cart_serializer = ShoppingCartSerializer(cart)
                return Response(cart_serializer.data, status=status.HTTP_200_OK)
                
            except ShoppingCartItem.DoesNotExist:
                return Response(
                    {"error": "El producto no está en el carrito."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(quantity_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def increase_quantity(self, request):
        #Aumenta la cantidad de un producto en 1
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response(
                {"error": "Se requiere product_id."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = self.get_or_create_cart()
            cart_item = ShoppingCartItem.objects.get(
                shopping_cart=cart,
                product_id=product_id
            )
            
            # Verificar stock disponible
            if cart_item.product.stock <= cart_item.quantity:
                return Response(
                    {"error": f"Stock insuficiente. Solo quedan {cart_item.product.stock} unidades disponibles."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cart_item.quantity += 1
            cart_item.save()
            
            # Devolver el carrito actualizado
            cart_serializer = ShoppingCartSerializer(cart)
            return Response(cart_serializer.data, status=status.HTTP_200_OK)
            
        except ShoppingCartItem.DoesNotExist:
            return Response(
                {"error": "El producto no está en el carrito."}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def decrease_quantity(self, request):
        #Disminuye la cantidad de un producto en 1, lo elimina si llega a 0
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response(
                {"error": "Se requiere product_id."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = self.get_or_create_cart()
            cart_item = ShoppingCartItem.objects.get(
                shopping_cart=cart,
                product_id=product_id
            )
            
            if cart_item.quantity <= 1:
                # Si la cantidad es 1 o menos, eliminar el item
                cart_item.delete()
            else:
                cart_item.quantity -= 1
                cart_item.save()
            
            # Devolver el carrito actualizado
            cart_serializer = ShoppingCartSerializer(cart)
            return Response(cart_serializer.data, status=status.HTTP_200_OK)
            
        except ShoppingCartItem.DoesNotExist:
            return Response(
                {"error": "El producto no está en el carrito."}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def check_item(self, request):
        #Verifica si un producto está en el carrito y devuelve su cantidad
        product_id = request.query_params.get('product_id')
        
        if not product_id:
            return Response(
                {"error": "Se requiere product_id como parámetro de consulta."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = self.get_or_create_cart()
            cart_item = ShoppingCartItem.objects.get(
                shopping_cart=cart,
                product_id=product_id
            )
            
            return Response({
                "in_cart": True,
                "quantity": cart_item.quantity,
                "item_id": cart_item.id
            })
            
        except ShoppingCartItem.DoesNotExist:
            return Response({
                "in_cart": False,
                "quantity": 0,
                "item_id": None
            })

    @action(detail=False, methods=['post'])
    def clear_cart(self, request):
        #Vacía completamente el carrito
        cart = self.get_or_create_cart()
        cart.shoppingcartitem_set.all().delete()
        
        # Devolver el carrito vacío
        cart_serializer = ShoppingCartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        #Devuelve un resumen del carrito con totales
        cart = self.get_or_create_cart()
        
        total_items = cart.shoppingcartitem_set.count()
        total_quantity = sum(item.quantity for item in cart.shoppingcartitem_set.all())
        total_price = sum(item.product.price * item.quantity for item in cart.shoppingcartitem_set.all())
        
        return Response({
            "total_items": total_items,
            "total_quantity": total_quantity,
            "total_price": total_price,
            "cart_id": cart.id
        })
        
