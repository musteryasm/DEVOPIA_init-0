from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    USER_TYPE_CHOICES = (
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    standard = models.IntegerField(null=True, blank=True)

class Subject(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Challenge(models.Model):
    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    )

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    option1 = models.CharField(max_length=50)
    option2 = models.CharField(max_length=50)
    option3 = models.CharField(max_length=50)
    option4 = models.CharField(max_length=50)
    correct_answer = models.CharField(max_length=50)
    standard = models.IntegerField()
    lesson = models.IntegerField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='Easy')  # Added difficulty level field

    def __str__(self):
        return self.question

class Marks(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    total_marks = models.IntegerField(default=0)
    obtained_marks = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'subject')
