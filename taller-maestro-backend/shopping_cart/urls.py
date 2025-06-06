from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'cart', views.ShoppingCartViewSet, basename='shopping-cart')

urlpatterns = [
    path('cart/', views.ShoppingCartViewSet.as_view({'get': 'list'}), name='shopping-cart'),
    path('cart/add/', views.ShoppingCartViewSet.as_view({'post': 'add_item'}), name='add-to-cart'),
    path('cart/remove/', views.ShoppingCartViewSet.as_view({'post': 'remove_item'}), name='remove-from-cart'),
    path('cart/update/', views.ShoppingCartViewSet.as_view({'post': 'update_quantity'}), name='update-cart-quantity'),
    path('cart/increase/', views.ShoppingCartViewSet.as_view({'post': 'increase_quantity'}), name='increase-cart-quantity'),
    path('cart/decrease/', views.ShoppingCartViewSet.as_view({'post': 'decrease_quantity'}), name='decrease-cart-quantity'),
    path('cart/check/', views.ShoppingCartViewSet.as_view({'get': 'check_item'}), name='check-cart-item'),
    path('cart/clear/', views.ShoppingCartViewSet.as_view({'post': 'clear_cart'}), name='clear-cart'),
    path('cart/summary/', views.ShoppingCartViewSet.as_view({'get': 'summary'}), name='cart-summary'),
]

urlpatterns += router.urls 