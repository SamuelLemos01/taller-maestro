from django.urls import path
from . import views

urlpatterns = [
    path('catalog/', views.ProductListView.as_view(), name='product-list'),
    path('featured/', views.FeaturedProductListView.as_view(), name='featured-products'),
    path('new/', views.NewProductListView.as_view(), name='new-products'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('detail/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
] 