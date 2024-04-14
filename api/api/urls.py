from django.urls import path
from .views import signup, login_view, logout_view, subject, index, user_info, quiz, add_marks
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', csrf_exempt(index), name='index'),
    path('signup', csrf_exempt(signup), name='signup'),
    path('login', csrf_exempt(login_view), name='login'),
    path('logout', csrf_exempt(logout_view), name='logout'),
    path('subject', csrf_exempt(subject), name='subject'),
    path('user', user_info, name='user_info'),
    path('quiz/<int:subject_id>/<int:standard>/<int:lesson>', csrf_exempt(quiz), name='quiz'),
    path('add_marks', csrf_exempt(add_marks), name='add_marks')
]
