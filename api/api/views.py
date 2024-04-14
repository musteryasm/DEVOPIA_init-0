from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Subject, Challenge
from django.http import HttpResponseNotAllowed
from .models import UserProfile, Marks
from django.shortcuts import get_object_or_404


def index(request):
    return JsonResponse({'Server': 'Devopia'})


@csrf_exempt
@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        user_type = request.data.get('user_type')
        standard = request.data.get('standard')

        if user_type == 'student':
            if not standard:
                return JsonResponse({'message': 'Standard is required for student'}, status=400)
            try:
                standard = int(standard)
                if standard < 1 or standard > 10:
                    return JsonResponse({'message': 'Standard must be between 1 and 10'}, status=400)
            except ValueError:
                return JsonResponse({'message': 'Standard must be an integer'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
        
        if user:
            UserProfile.objects.create(user=user, user_type=user_type, standard=standard)
            return JsonResponse({'message': 'User created successfully'})
        else:
            return JsonResponse({'message': 'Error creating user'}, status=500)
        


@csrf_exempt
@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        
        if email is None or password is None:
            return JsonResponse({'error': 'Please provide both email and password'}, status=400)

        user = User.objects.filter(email=email).first()

        if user is None:
            return JsonResponse({'error': 'User not found'}, status=404)

        user = authenticate(request, username=user.username, password=password)

        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({'token': token.key})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)



@csrf_exempt
@api_view(['POST'])
def logout_view(request):
    if request.method == 'POST':
        auth_token = request.headers.get('Authorization', '').split()[1]
        Token.objects.get(key=auth_token).delete()
        logout(request)
        return JsonResponse({'message': 'Logged out successfully'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@api_view(['POST', 'GET'])
def subject(request):
    user = get_user_from_token(request)
    if not user:
        return JsonResponse({'error': 'Signin required'}, status=403)

    user_profile = UserProfile.objects.get(user=user)
    user_type = user_profile.user_type

    if request.method == 'POST':
        if user_type == 'teacher':
            name = request.data.get('name')
            if name:
                subject = Subject.objects.create(name=name)
                return JsonResponse({'message': 'Subject added successfully', 'id': subject.id}, status=201)
            else:
                return JsonResponse({'error': 'Name field is required'}, status=400)
        else:
            return JsonResponse({'error': 'Permission denied. Only teachers can perform this action.'}, status=403)
    
    elif request.method == 'GET':
        subjects = Subject.objects.all()
        subject_data = [{'id': subject.id, 'name': subject.name} for subject in subjects]
        return JsonResponse({'subjects': subject_data})
    
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


def get_user_from_token(request):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        try:
            _, token_key = auth_header.split()
            token = Token.objects.get(key=token_key)
            return token.user
        except (ValueError, Token.DoesNotExist):
            pass
    return None


@api_view(['GET'])
def user_info(request):
    user = get_user_from_token(request)
    is_superuser = user.is_superuser
    type = UserProfile.objects.get(user=user).user_type
    username = user.username
    email = user.email
    date_joined = user.date_joined
    first_name = user.first_name
    last_name = user.last_name
    standard = UserProfile.objects.get(user=user).standard
    response_json = {
        'admin': is_superuser,
        'username': username,
        'email': email,
        'date_joined': date_joined,
        'user_type': type,
        'first_name': first_name,
        'last_name': last_name,
    }

    if type == 'student':
        response_json['standard'] = standard
    return JsonResponse(response_json)



# @csrf_exempt
# @api_view(['POST'])
# def quiz(request):
#     user = get_user_from_token(request)
#     if not user:
#         return JsonResponse({'error': 'Signin required'}, status=403)

#     user_profile = UserProfile.objects.get(user=user)
#     user_type = user_profile.user_type

#     if request.method == 'POST':
#         if user_type == 'teacher':
#             subject_id = request.data.get('subject_id')
#             question = request.data.get('question')
#             option1 = request.data.get('option1')
#             option2 = request.data.get('option2')
#             option3 = request.data.get('option3')
#             option4 = request.data.get('option4')
#             correct_answer = request.data.get('correct_answer')
#             standard = request.data.get('standard')
#             lesson = request.data.get('lesson')

#             if subject_id and question and option1 and option2 and option3 and option4 and correct_answer and standard and lesson:
#                 try:
#                     subject = Subject.objects.get(id=subject_id)
#                 except Subject.DoesNotExist:
#                     return JsonResponse({'error': 'Subject not found'}, status=404)
                
#                 try:
#                     standard = int(standard)
#                     lesson = int(lesson)
#                     if standard < 1 or standard > 10:
#                         return JsonResponse({'message': 'Standard must be between 1 and 10'}, status=400)
#                     if lesson < 1 or lesson > 10:
#                         return JsonResponse({'message': 'Lesson must be between 1 and 10'}, status=400)
#                 except ValueError:
#                     return JsonResponse({'message': 'Standard and lesson must be integers'}, status=400)

#                 Challenge.objects.create(subject=subject, question=question, option1=option1, option2=option2, option3=option3, option4=option4, correct_answer=correct_answer, standard=standard, lesson=lesson)
#                 return JsonResponse({'message': 'Challenge added successfully'}, status=201)
#             else:
#                 return JsonResponse({'error': 'All fields are required'}, status=400)
#         else:
#             return JsonResponse({'error': 'Permission denied. Only teachers can perform this action.'}, status=403)
    
#     else:
#         return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@api_view(['POST', 'GET'])
def quiz(request, subject_id, standard, lesson):
    if request.method == 'GET':
        # Retrieve the challenges filtered by subject, standard, and lesson
        challenges = Challenge.objects.filter(subject_id=subject_id, standard=standard, lesson=lesson)

        # Serialize the challenges into JSON format
        challenge_data = [{
            'question': challenge.question,
            'option1': challenge.option1,
            'option2': challenge.option2,
            'option3': challenge.option3,
            'option4': challenge.option4,
            'correct_answer': challenge.correct_answer,
            'difficulty': challenge.difficulty,  # Include difficulty level
        } for challenge in challenges]

        # Return the JSON response
        return JsonResponse({'challenges': challenge_data})
    
    elif request.method == 'POST':
        # Parse request data to create a new challenge
        question = request.data.get('question')
        option1 = request.data.get('option1')
        option2 = request.data.get('option2')
        option3 = request.data.get('option3')
        option4 = request.data.get('option4')
        correct_answer = request.data.get('correct_answer')
        difficulty = request.data.get('difficulty')  # Get difficulty level

        # Check if the subject exists
        subject = get_object_or_404(Subject, pk=subject_id)

        # Create and save the new challenge
        new_challenge = Challenge.objects.create(
            subject=subject,
            question=question,
            option1=option1,
            option2=option2,
            option3=option3,
            option4=option4,
            correct_answer=correct_answer,
            standard=standard,
            lesson=lesson,
            difficulty=difficulty,  # Save difficulty level
        )

        return JsonResponse({'message': 'New challenge added successfully', 'challenge_id': new_challenge.id}, status=201)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    


@csrf_exempt
@api_view(['GET', 'POST'])
def add_marks(request):
    user = get_user_from_token(request)
    if not user:
        return JsonResponse({'error': 'Signin required'}, status=403)
    
    user_profile = UserProfile.objects.get(user=user)
    user_type = user_profile.user_type

    if request.method == 'POST':
        if user_type == 'student':
            user_id = user.id
            data = request.data
            subject_id = data.get('subject_id')
            marks = int(data.get('marks', 0))
            total_marks = int(data.get('total_marks', 0))

            user_profile = get_object_or_404(UserProfile, user_id=user_id, user_type='student')
            subject = get_object_or_404(Subject, pk=subject_id)

            user_marks, created = user_profile.marks_set.get_or_create(subject=subject)
            user_marks.total_marks = total_marks
            user_marks.obtained_marks += marks
            user_marks.save()

            return JsonResponse({'message': 'Marks added successfully'}, status=201)

        else:
            return JsonResponse({'error': 'Method not allowed'}, status=405)

    elif request.method == 'GET':
        if user_type == 'teacher':
            students = UserProfile.objects.filter(user_type='student')
            marks_data = []

            for student in students:
                student_marks_data = {
                    'student_id': student.user.id,
                    'student_username': student.user.username,
                    'student_first_name': student.user.first_name,
                    'student_last_name': student.user.last_name,
                    'total_marks': 0,
                    'obtained_marks': 0,  # Initialize obtained marks for each student
                    'subjects': []
                }

                total_marks = 0
                obtained_marks = 0
                subjects = Subject.objects.all()
                for subject in subjects:
                    student_marks = Marks.objects.filter(user=student, subject=subject).first()
                    if student_marks:
                        total_marks += student_marks.total_marks
                        obtained_marks += student_marks.obtained_marks
                        student_marks_data['subjects'].append({
                            'subject_id': subject.id,
                            'subject_name': subject.name,
                            'total_marks': student_marks.total_marks,
                            'obtained_marks': student_marks.obtained_marks
                        })

                student_marks_data['total_marks'] = total_marks
                student_marks_data['obtained_marks'] = obtained_marks
                marks_data.append(student_marks_data)

            return JsonResponse({'marks': marks_data})

        else:
            return JsonResponse({'error': 'Method not allowed'}, status=405)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)