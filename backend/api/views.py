from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Client
from .serializers import ClientSerializer
# Create your views here.

class ClientAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, client_id=None):
        if client_id:
            client = Client.objects.get(id=client_id)
            serializer = ClientSerializer(client)
            return Response(serializer.data)
        clients = Client.objects.all()
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data = request.data

        if Client.objects.filter(email=data.get('email')).exists():
            return Response(
                {"error": "A user with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if Client.objects.filter(phone=data.get('phone')).exists():
            return Response(
                {"error": "A user with this phone number already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ClientSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, client_id):
        client = Client.objects.get(id=client_id)
        serializer = ClientSerializer(client, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, client_id):
        client = Client.objects.get(id=client_id)
        client.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        