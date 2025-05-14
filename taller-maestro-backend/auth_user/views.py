from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
import json
from .models import User
from django.contrib.auth import logout
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer

# Create your views here.

@csrf_exempt
def signup_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Validar que todos los campos requeridos estén presentes
            required_fields = ['firstName', 'lastName', 'phone', 'email', 'password']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({'error': f'El campo {field} es requerido'}, status=400)
            
            # Verificar si el email ya existe
            if User.objects.filter(email=data['email']).exists():
                return JsonResponse({'error': 'Este correo electrónico ya está registrado'}, status=400)
            
            # Crear el nuevo usuario
            user = User.objects.create(
                first_name=data['firstName'],
                last_name=data['lastName'],
                phone=data['phone'],
                email=data['email'],
                password=make_password(data['password'])
            )
            
            return JsonResponse({
                'message': 'Usuario registrado exitosamente',
                'user': {
                    'id': user.id,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'email': user.email,
                    'phone': user.phone
                }
            }, status=201)
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Datos JSON inválidos'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'error': 'Correo y contraseña son obligatorios'}, status=400)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Usuario o contraseña incorrectos'}, status=401)

            if not check_password(password, user.password):
                return JsonResponse({'error': 'Usuario o contraseña incorrectos'}, status=401)

            return JsonResponse({
                'message': 'Inicio de sesión exitoso',
                'user': {
                    'id': user.id,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'email': user.email,
                    'phone': user.phone
                }
            }, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

#def logout(request):
 #   logout(request)
  #  return redirect('')

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
