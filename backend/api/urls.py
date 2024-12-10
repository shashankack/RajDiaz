from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('clients/', ClientAPIView.as_view(), name='clients'),
    path('clients/<int:client_id>/', ClientAPIView.as_view(), name='client'),
]
