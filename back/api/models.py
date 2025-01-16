from django.db import models


class Task(models.Model):
    PRIORITY_CHOICES = [(1, 'Low'), (2, 'Medium'), (3, 'High')]
    CATEGORY_CHOICES = [
        ('entertainment', 'Rozrywka'),
        ('regular', 'Zadania zwykłe'),
        ('mandatory', 'Obowiązkowe zadania'),
    ]

    title = models.CharField(max_length=255)
    date = models.DateTimeField()
    priority = models.IntegerField(default=1)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='regular')
    
    def __str__(self):
        return self.title