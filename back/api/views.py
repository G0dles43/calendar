from django.shortcuts import render
from rest_framework.response import  Response
from rest_framework.decorators import api_view
from .models import Task
from .serializers import TaskSerializer


@api_view(['GET'])
def getTasks(request):
        tasks=Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def getTaskById(request, pk):
        try:
                task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
                return Response({'error': 'Task not found'})

        serializer = TaskSerializer(task, many=False)
        return Response(serializer.data)

@api_view(['POST'])
def addTask(request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
                serializer.save()
        return Response(serializer.data)

@api_view(['PUT'])
def updateTask(request, pk):
    try:
        task = Task.objects.get(id=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'})

    serializer = TaskSerializer(task, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['DELETE'])
def deleteTask(request, pk):
    try:
        task = Task.objects.get(id=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'})

    task.delete()
    return Response({'message': 'Task deleted successfully'})