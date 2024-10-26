from django.urls import path
from . import views

urlpatterns = [
    path('receive/', views.receive_audio, name='receive_audio'),
    path('end_conversation/', views.end_conversation, name='end_conversation'),
]