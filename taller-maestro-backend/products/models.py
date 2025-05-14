from django.db import models
from django.utils import timezone
from django.urls import reverse
from django.utils.text import slugify
from django.contrib.auth.models import User 
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nombre")
    slug = models.SlugField(unique=True, verbose_name="Slug")

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class ProductImage(models.Model):
    product = models.ForeignKey('Product', related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/', verbose_name="Imagen")
    is_main = models.BooleanField(default=False, verbose_name="Imagen Principal")

    class Meta:
        verbose_name = "Imagen del Producto"
        verbose_name_plural = "Imágenes del Producto"

    def __str__(self):
        return f"Imagen de {self.product.name}"

class Product(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nombre")
    slug = models.SlugField(unique=True, verbose_name="Slug", blank=True)
    description = models.TextField(verbose_name="Descripción")
    price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name="Precio")
    image = models.ImageField(upload_to='products/', verbose_name="Imagen Principal")
    stock = models.PositiveIntegerField(default=0, verbose_name="Stock")
    is_featured = models.BooleanField(default=False, verbose_name="Destacado")
    is_new = models.BooleanField(default=True, verbose_name="Nuevo")
    in_catalog = models.BooleanField(default=True, verbose_name="Mostrar en Catálogo")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products', verbose_name="Categoría")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última actualización")

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('product-detail', kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        
        # Un producto se considera nuevo si fue creado hace menos de 30 días
        if not self.id:
            self.is_new = True
        elif (timezone.now() - self.created_at).days > 30:
            self.is_new = False
        super().save(*args, **kwargs)

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')  # Un usuario no puede tener el mismo producto dos veces

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
