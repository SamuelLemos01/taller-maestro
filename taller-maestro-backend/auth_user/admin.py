from django.contrib import admin
from .models import User

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone', 'email', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone', 'email')
    list_filter = ('created_at',)
    list_per_page = 10