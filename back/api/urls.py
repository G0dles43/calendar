from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.getTasks),
    path('<int:pk>/', views.getTaskById, name='get-task-by-id'),
    path('add/', views.addTask),
    path('update/<int:pk>/', views.updateTask, name='update-task'),
    path('delete/<int:pk>/', views.deleteTask, name='delete-task'),
]