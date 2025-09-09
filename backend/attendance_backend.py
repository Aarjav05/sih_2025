# app.py - Main Flask Application
from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import face_recognition
import cv2
import numpy as np
from PIL import Image
import base64
import io
import os
import json
from datetime import datetime, timedelta
import logging
from functools import wraps
import uuid



image_path = 'uploads/Aaditya.jpeg'  # Adjust filename if needed

with open(image_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

print(f"data:image/jpeg;base64,{encoded_string}")


# # Initialize Flask app
# from config_py import config

# # Initialize Flask app
# app = Flask(__name__)
# app.config.from_object(config['development'])  # or 'production' / 'testing'


# # Initialize extensions
# db = SQLAlchemy(app)
# jwt = JWTManager(app)
# CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:5500"])

# # Ensure upload directory exists
# os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Database Models
# class User(db.Model):
#     __tablename__ = 'users'
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password_hash = db.Column(db.String(255), nullable=False)
#     role = db.Column(db.String(20), nullable=False)  # teacher, principal, district
#     name = db.Column(db.String(100), nullable=False)
#     school_id = db.Column(db.Integer, db.ForeignKey('schools.id'))
#     district_id = db.Column(db.Integer, db.ForeignKey('districts.id'))
#     is_active = db.Column(db.Boolean, default=True)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
#     # Relationships
#     school = db.relationship('School', backref='users', foreign_keys=[school_id])
#     district = db.relationship('District', backref='users', foreign_keys=[district_id])


# class District(db.Model):
#     __tablename__ = 'districts'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     state = db.Column(db.String(50), nullable=False)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

# class School(db.Model):
#     __tablename__ = 'schools'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     address = db.Column(db.Text)
#     district_id = db.Column(db.Integer, db.ForeignKey('districts.id'), nullable=False)
#     principal_id = db.Column(db.Integer, db.ForeignKey('users.id'))
#     is_active = db.Column(db.Boolean, default=True)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
#     # Relationships
#     district = db.relationship('District', backref='schools')

# class Student(db.Model):
#     __tablename__ = 'students'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     student_id = db.Column(db.String(50), unique=True, nullable=False)
#     class_name = db.Column(db.String(20), nullable=False)  # class-1, class-2, etc.
#     school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
#     guardian_name = db.Column(db.String(100), nullable=False)
#     guardian_phone = db.Column(db.String(15), nullable=False)
#     health_notes = db.Column(db.Text)
#     face_encoding = db.Column(db.Text)  # JSON encoded face features
#     is_active = db.Column(db.Boolean, default=True)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
#     # Relationships
#     school = db.relationship('School', backref='students')

# class TeacherAssignment(db.Model):
#     __tablename__ = 'teacher_assignments'
#     id = db.Column(db.Integer, primary_key=True)
#     teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     class_name = db.Column(db.String(20), nullable=False)
#     subject = db.Column(db.String(50), nullable=False)
#     school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
#     # Relationships
#     teacher = db.relationship('User', backref='assignments', foreign_keys=[teacher_id])
#     school = db.relationship('School', backref='teacher_assignments')

# class PhotoUpload(db.Model):
#     __tablename__ = 'photo_uploads'
#     id = db.Column(db.Integer, primary_key=True)
#     session_id = db.Column(db.String(36), unique=True, nullable=False)
#     uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     class_name = db.Column(db.String(20), nullable=False)
#     school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
#     image_path = db.Column(db.String(255))
#     processing_status = db.Column(db.String(20), default='pending')  # pending, processing, completed, failed
#     detected_faces_count = db.Column(db.Integer, default=0)
#     recognition_results = db.Column(db.Text)  # JSON encoded results
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
#     # Relationships
#     uploader = db.relationship('User', backref='photo_uploads')
#     school = db.relationship('School', backref='photo_uploads')

# class AttendanceRecord(db.Model):
#     __tablename__ = 'attendance_records'
#     id = db.Column(db.Integer, primary_key=True)
#     student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
#     date = db.Column(db.Date, nullable=False)
#     status = db.Column(db.String(10), nullable=False)  # present, absent
#     confidence_score = db.Column(db.Float)  # for face recognition confidence
#     method = db.Column(db.String(20), nullable=False)  # face_recognition, manual
#     recorded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     session_id = db.Column(db.String(36))  # Link to photo upload session
#     notes = db.Column(db.Text)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
#     # Relationships
#     student = db.relationship('Student', backref='attendance_records')
#     recorder = db.relationship('User', backref='attendance_records', foreign_keys=[recorded_by])


# class SMSHistory(db.Model):
#     __tablename__ = 'sms_history'
#     id = db.Column(db.Integer, primary_key=True)
#     school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
#     recipients = db.Column(db.String(50), nullable=False)  # all, class, absent
#     target_class = db.Column(db.String(20))
#     message = db.Column(db.Text, nullable=False)
#     recipient_count = db.Column(db.Integer, nullable=False)
#     sent_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     sent_at = db.Column(db.DateTime, default=datetime.utcnow)
    
#     # Relationships
#     school = db.relationship('School', backref='sms_history')
#     sender = db.relationship('User', backref='sms_history', foreign_keys=[sent_by])


# # Permission decorators
# def require_role(allowed_roles):
#     def decorator(f):
#         @wraps(f)
#         @jwt_required()
#         def decorated_function(*args, **kwargs):
#             current_user_id = get_jwt_identity()
#             user = User.query.get(current_user_id)
            
#             if not user or not user.is_active:
#                 return jsonify({'error': 'User not found or inactive'}), 401
            
#             if user.role not in allowed_roles:
#                 return jsonify({'error': 'Insufficient permissions'}), 403
                
#             return f(user, *args, **kwargs)
#         return decorated_function
#     return decorator

# def require_school_access(f):
#     @wraps(f)
#     def decorated_function(user, *args, **kwargs):
#         school_id = request.json.get('school_id') or request.args.get('school_id')
        
#         if user.role == 'district':
#             # District users can access any school in their district
#             if school_id:
#                 school = School.query.get(school_id)
#                 if not school or school.district_id != user.district_id:
#                     return jsonify({'error': 'School access denied'}), 403
#         elif user.role in ['principal', 'teacher']:
#             # School-level users can only access their own school
#             if school_id and int(school_id) != user.school_id:
#                 return jsonify({'error': 'School access denied'}), 403
                
#         return f(user, *args, **kwargs)
#     return decorated_function

# # Utility functions for face recognition
# def encode_face_from_base64(image_data):
#     """Convert base64 image to face encoding"""
#     try:
#         # Remove data URL prefix if present
#         if ',' in image_data:
#             image_data = image_data.split(',')[1]
            
#         # Decode base64 to image
#         image_bytes = base64.b64decode(image_data)
#         image = Image.open(io.BytesIO(image_bytes))
        
#         # Convert to RGB if necessary
#         if image.mode != 'RGB':
#             image = image.convert('RGB')
        
#         # Convert to numpy array
#         image_array = np.array(image)
        
#         # Get face encodings
#         face_encodings = face_recognition.face_encodings(image_array)
        
#         if len(face_encodings) == 0:
#             return None
        
#         return face_encodings[0]  # Return first face found
        
#     except Exception as e:
#         logger.error(f"Error generating class report: {str(e)}")
#         return jsonify({'error': 'Failed to generate report'}), 500

# # SMS Communication Routes
# @app.route('/api/sms/send', methods=['POST'])
# @require_role(['principal'])
# @require_school_access
# def send_sms(user):
#     try:
#         data = request.get_json()
        
#         recipients = data.get('recipients')  # all, class, absent
#         target_class = data.get('target_class')
#         message = data.get('message', '').strip()
        
#         if not recipients or not message:
#             return jsonify({'error': 'Recipients and message required'}), 400
        
#         if len(message) > 160:
#             return jsonify({'error': 'Message too long (max 160 characters)'}), 400
        
#         # Get target students based on recipient type
#         target_students = []
        
#         if recipients == 'all':
#             target_students = Student.query.filter_by(
#                 school_id=user.school_id,
#                 is_active=True
#             ).all()
#         elif recipients == 'class':
#             if not target_class:
#                 return jsonify({'error': 'Class required for class-specific SMS'}), 400
#             target_students = Student.query.filter_by(
#                 school_id=user.school_id,
#                 class_name=target_class,
#                 is_active=True
#             ).all()
#         elif recipients == 'absent':
#             # Find students absent today
#             today = datetime.utcnow().date()
#             present_student_ids = db.session.query(AttendanceRecord.student_id).filter(
#                 AttendanceRecord.date == today,
#                 AttendanceRecord.status == 'present'
#             ).subquery()
            
#             target_students = Student.query.filter(
#                 Student.school_id == user.school_id,
#                 Student.is_active == True,
#                 ~Student.id.in_(present_student_ids)
#             ).all()
        
#         # Simulate SMS sending (in real implementation, integrate with SMS gateway)
#         recipient_count = len(target_students)
        
#         for student in target_students:
#             logger.info(f"SMS SENT: {student.guardian_name} ({student.guardian_phone}) - {message}")
        
#         # Save SMS history
#         sms_record = SMSHistory(
#             school_id=user.school_id,
#             recipients=recipients,
#             target_class=target_class,
#             message=message,
#             recipient_count=recipient_count,
#             sent_by=user.id
#         )
        
#         db.session.add(sms_record)
#         db.session.commit()
        
#         return jsonify({
#             'message': f'SMS sent to {recipient_count} parents',
#             'recipient_count': recipient_count
#         })
        
#     except Exception as e:
#         logger.error(f"Error sending SMS: {str(e)}")
#         return jsonify({'error': 'Failed to send SMS'}), 500

# @app.route('/api/sms/history', methods=['GET'])
# @require_role(['principal'])
# def sms_history(user):
#     try:
#         history = SMSHistory.query.filter_by(school_id=user.school_id)\
#                     .order_by(SMSHistory.sent_at.desc())\
#                     .limit(50).all()
        
#         history_data = []
#         for record in history:
#             history_data.append({
#                 'id': record.id,
#                 'recipients': record.recipients,
#                 'target_class': record.target_class,
#                 'message': record.message,
#                 'recipient_count': record.recipient_count,
#                 'sent_by': record.sender.name,
#                 'sent_at': record.sent_at.isoformat()
#             })
        
#         return jsonify({'history': history_data})
        
#     except Exception as e:
#         logger.error(f"Error fetching SMS history: {str(e)}")
#         return jsonify({'error': 'Failed to fetch SMS history'}), 500

# # Manual Attendance Override Routes
# @app.route('/api/attendance/manual-override', methods=['POST'])
# @require_role(['principal'])
# def manual_attendance_override(user):
#     try:
#         data = request.get_json()
        
#         student_id = data.get('student_id')
#         date_str = data.get('date')
#         status = data.get('status')  # present, absent
#         reason = data.get('reason', '')
#         notes = data.get('notes', '')
        
#         if not all([student_id, date_str, status]):
#             return jsonify({'error': 'Student ID, date, and status required'}), 400
        
#         attendance_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
#         # Verify student exists and belongs to user's school
#         student = Student.query.get(student_id)
#         if not student or student.school_id != user.school_id:
#             return jsonify({'error': 'Student not found or access denied'}), 404
        
#         # Check if attendance record already exists for this date
#         existing_record = AttendanceRecord.query.filter_by(
#             student_id=student_id,
#             date=attendance_date
#         ).first()
        
#         if existing_record:
#             # Update existing record
#             existing_record.status = status
#             existing_record.method = 'manual_override'
#             existing_record.recorded_by = user.id
#             existing_record.notes = f"Override: {reason}. {notes}".strip()
#             existing_record.confidence_score = None
#         else:
#             # Create new record
#             new_record = AttendanceRecord(
#                 student_id=student_id,
#                 date=attendance_date,
#                 status=status,
#                 method='manual_override',
#                 recorded_by=user.id,
#                 notes=f"Override: {reason}. {notes}".strip() if reason else notes
#             )
#             db.session.add(new_record)
        
#         db.session.commit()
        
#         logger.info(f"Manual attendance override: {student.name} marked {status} for {date_str} by {user.name}")
        
#         return jsonify({'message': 'Attendance updated successfully'})
        
#     except ValueError:
#         return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error in manual attendance override: {str(e)}")
#         return jsonify({'error': 'Failed to update attendance'}), 500

# # Teacher Management Routes
# @app.route('/api/teachers', methods=['POST'])
# @require_role(['principal'])
# def add_teacher(user):
#     try:
#         data = request.get_json()
        
#         required_fields = ['name', 'email', 'password', 'subjects', 'assigned_classes']
#         for field in required_fields:
#             if not data.get(field):
#                 return jsonify({'error': f'{field} is required'}), 400
        
#         email = data['email'].lower().strip()
        
#         # Check if email already exists
#         if User.query.filter_by(email=email).first():
#             return jsonify({'error': 'Email already exists'}), 400
        
#         # Create teacher user
#         teacher = User(
#             email=email,
#             password_hash=generate_password_hash(data['password']),
#             name=data['name'].strip(),
#             role='teacher',
#             school_id=user.school_id
#         )
        
#         db.session.add(teacher)
#         db.session.flush()  # Get teacher ID
        
#         # Add teacher assignments
#         subjects = data['subjects'] if isinstance(data['subjects'], list) else [data['subjects']]
#         classes = data['assigned_classes'] if isinstance(data['assigned_classes'], list) else [data['assigned_classes']]
        
#         for class_name in classes:
#             for subject in subjects:
#                 assignment = TeacherAssignment(
#                     teacher_id=teacher.id,
#                     class_name=class_name,
#                     subject=subject,
#                     school_id=user.school_id
#                 )
#                 db.session.add(assignment)
        
#         db.session.commit()
        
#         logger.info(f"Teacher {teacher.name} added by {user.name}")
        
#         return jsonify({
#             'message': 'Teacher added successfully',
#             'teacher_id': teacher.id
#         }), 201
        
#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error adding teacher: {str(e)}")
#         return jsonify({'error': 'Failed to add teacher'}), 500

# @app.route('/api/teachers', methods=['GET'])
# @require_role(['principal'])
# def get_teachers(user):
#     try:
#         teachers = User.query.filter_by(
#             role='teacher',
#             school_id=user.school_id,
#             is_active=True
#         ).all()
        
#         teachers_data = []
#         for teacher in teachers:
#             assignments = TeacherAssignment.query.filter_by(teacher_id=teacher.id).all()
            
#             teachers_data.append({
#                 'id': teacher.id,
#                 'name': teacher.name,
#                 'email': teacher.email,
#                 'assignments': [{
#                     'class_name': assignment.class_name,
#                     'subject': assignment.subject
#                 } for assignment in assignments],
#                 'created_at': teacher.created_at.isoformat()
#             })
        
#         return jsonify({'teachers': teachers_data})
        
#     except Exception as e:
#         logger.error(f"Error fetching teachers: {str(e)}")
#         return jsonify({'error': 'Failed to fetch teachers'}), 500

# # Analytics Routes
# @app.route('/api/analytics/school', methods=['GET'])
# @require_role(['principal'])
# def school_analytics(user):
#     try:
#         start_date = request.args.get('start_date')
#         end_date = request.args.get('end_date')
        
#         if not start_date or not end_date:
#             # Default to last 30 days
#             end_date = datetime.utcnow().date()
#             start_date = end_date - timedelta(days=30)
#         else:
#             start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
#             end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        
#         # Get total students
#         total_students = Student.query.filter_by(
#             school_id=user.school_id,
#             is_active=True
#         ).count()
        
#         # Get attendance records for date range
#         attendance_query = db.session.query(AttendanceRecord, Student).join(Student)
#         attendance_query = attendance_query.filter(
#             Student.school_id == user.school_id,
#             AttendanceRecord.date.between(start_date, end_date)
#         )
        
#         records = attendance_query.all()
        
#         # Calculate daily attendance rates
#         daily_stats = {}
#         class_stats = {}
        
#         for record, student in records:
#             date_str = record.date.isoformat()
#             class_name = student.class_name
            
#             # Daily stats
#             if date_str not in daily_stats:
#                 daily_stats[date_str] = {'total': 0, 'present': 0}
#             daily_stats[date_str]['total'] += 1
#             if record.status == 'present':
#                 daily_stats[date_str]['present'] += 1
            
#             # Class stats
#             if class_name not in class_stats:
#                 class_stats[class_name] = {'total': 0, 'present': 0}
#             class_stats[class_name]['total'] += 1
#             if record.status == 'present':
#                 class_stats[class_name]['present'] += 1
        
#         # Calculate averages
#         daily_rates = []
#         for date_str, stats in daily_stats.items():
#             if stats['total'] > 0:
#                 rate = round((stats['present'] / stats['total']) * 100, 2)
#                 daily_rates.append({
#                     'date': date_str,
#                     'attendance_rate': rate,
#                     'present_count': stats['present'],
#                     'total_count': stats['total']
#                 })
        
#         # Class performance
#         class_performance = []
#         for class_name, stats in class_stats.items():
#             if stats['total'] > 0:
#                 rate = round((stats['present'] / stats['total']) * 100, 2)
#                 class_performance.append({
#                     'class_name': class_name,
#                     'attendance_rate': rate,
#                     'total_sessions': stats['total']
#                 })
        
#         # Overall average
#         overall_avg = 0
#         if daily_rates:
#             overall_avg = round(sum(day['attendance_rate'] for day in daily_rates) / len(daily_rates), 2)
        
#         # Best performing class
#         best_class = '-'
#         if class_performance:
#             best_class = max(class_performance, key=lambda x: x['attendance_rate'])['class_name']
        
#         return jsonify({
#             'period': {
#                 'start_date': start_date.isoformat(),
#                 'end_date': end_date.isoformat()
#             },
#             'overall_stats': {
#                 'total_students': total_students,
#                 'average_attendance': overall_avg,
#                 'best_performing_class': best_class,
#                 'total_teaching_days': len(daily_stats)
#             },
#             'daily_attendance': sorted(daily_rates, key=lambda x: x['date']),
#             'class_performance': sorted(class_performance, key=lambda x: x['attendance_rate'], reverse=True)
#         })
        
#     except Exception as e:
#         logger.error(f"Error generating school analytics: {str(e)}")
#         return jsonify({'error': 'Failed to generate analytics'}), 500

# # District-level Routes
# @app.route('/api/district/overview', methods=['GET'])
# @require_role(['district'])
# def district_overview(user):
#     try:
#         # Get all schools in district
#         schools = School.query.filter_by(district_id=user.district_id, is_active=True).all()
        
#         district_stats = {
#             'total_schools': len(schools),
#             'active_schools': len(schools),
#             'total_students': 0,
#             'total_teachers': 0,
#             'average_attendance': 0
#         }
        
#         school_summaries = []
#         attendance_rates = []
        
#         for school in schools:
#             # Get school statistics
#             students_count = Student.query.filter_by(school_id=school.id, is_active=True).count()
#             teachers_count = User.query.filter_by(school_id=school.id, role='teacher', is_active=True).count()
            
#             district_stats['total_students'] += students_count
#             district_stats['total_teachers'] += teachers_count
            
#             # Get recent attendance (last 7 days)
#             recent_date = datetime.utcnow().date() - timedelta(days=7)
#             attendance_query = db.session.query(AttendanceRecord, Student).join(Student)
#             attendance_query = attendance_query.filter(
#                 Student.school_id == school.id,
#                 AttendanceRecord.date >= recent_date
#             )
            
#             recent_records = attendance_query.all()
#             school_attendance_rate = 0
            
#             if recent_records:
#                 present_count = sum(1 for record, student in recent_records if record.status == 'present')
#                 school_attendance_rate = round((present_count / len(recent_records)) * 100, 2)
#                 attendance_rates.append(school_attendance_rate)
            
#             school_summaries.append({
#                 'school_id': school.id,
#                 'school_name': school.name,
#                 'address': school.address,
#                 'students_count': students_count,
#                 'teachers_count': teachers_count,
#                 'recent_attendance_rate': school_attendance_rate
#             })
        
#         # Calculate district average attendance
#         if attendance_rates:
#             district_stats['average_attendance'] = round(sum(attendance_rates) / len(attendance_rates), 2)
        
#         return jsonify({
#             'district_name': user.district.name,
#             'summary': district_stats,
#             'schools': school_summaries
#         })
        
#     except Exception as e:
#         logger.error(f"Error generating district overview: {str(e)}")
#         return jsonify({'error': 'Failed to generate district overview'}), 500

# # Health check and utility routes
# @app.route('/api/health', methods=['GET'])
# def health_check():
#     return jsonify({
#         'status': 'healthy',
#         'timestamp': datetime.utcnow().isoformat(),
#         'version': '1.0.0'
#     })

# @app.route('/api/init-demo-data', methods=['POST'])
# def init_demo_data():
#     try:
#         # Create district
#         district = District(name='Ahmednagar District', state='Maharashtra')
#         db.session.add(district)
#         db.session.flush()
        
#         # Create school
#         school = School(
#             name='Govt. Primary School, Village A',
#             address='Village A, Ahmednagar District, Maharashtra',
#             district_id=district.id
#         )
#         db.session.add(school)
#         db.session.flush()
        
#         # Create users
#         users_data = [
#             {
#                 'email': 'teacher@school.edu',
#                 'password': 'teacher123',
#                 'name': 'Mrs. Sunita Sharma',
#                 'role': 'teacher',
#                 'school_id': school.id
#             },
#             {
#                 'email': 'principal@school.edu',
#                 'password': 'principal123',
#                 'name': 'Mr. Rajesh Kumar',
#                 'role': 'principal',
#                 'school_id': school.id
#             },
#             {
#                 'email': 'district@education.gov',
#                 'password': 'district123',
#                 'name': 'Dr. Priya Patel',
#                 'role': 'district',
#                 'district_id': district.id
#             }
#         ]
        
#         created_users = []
#         for user_data in users_data:
#             user = User(
#                 email=user_data['email'],
#                 password_hash=generate_password_hash(user_data['password']),
#                 name=user_data['name'],
#                 role=user_data['role'],
#                 school_id=user_data.get('school_id'),
#                 district_id=user_data.get('district_id')
#             )
#             db.session.add(user)
#             created_users.append(user)
        
#         db.session.flush()
        
#         # Set principal
#         principal = next(u for u in created_users if u.role == 'principal')
#         school.principal_id = principal.id
        
#         # Create teacher assignments
#         teacher = next(u for u in created_users if u.role == 'teacher')
#         assignments = [
#             TeacherAssignment(teacher_id=teacher.id, class_name='class-1', subject='math', school_id=school.id),
#             TeacherAssignment(teacher_id=teacher.id, class_name='class-1', subject='science', school_id=school.id),
#             TeacherAssignment(teacher_id=teacher.id, class_name='class-2', subject='math', school_id=school.id)
#         ]
        
#         for assignment in assignments:
#             db.session.add(assignment)
        
#         # Create sample students (without face encodings for demo)
#         students_data = [
#             {'name': 'Aarav Sharma', 'student_id': 'STU001', 'class': 'class-1'},
#             {'name': 'Priya Patel', 'student_id': 'STU002', 'class': 'class-1'},
#             {'name': 'Rohit Kumar', 'student_id': 'STU003', 'class': 'class-1'},
#             {'name': 'Sneha Singh', 'student_id': 'STU004', 'class': 'class-2'},
#             {'name': 'Amit Yadav', 'student_id': 'STU005', 'class': 'class-2'}
#         ]
        
#         for student_data in students_data:
#             student = Student(
#                 name=student_data['name'],
#                 student_id=student_data['student_id'],
#                 class_name=student_data['class'],
#                 school_id=school.id,
#                 guardian_name=f"{student_data['name'].split()[0]} Guardian",
#                 guardian_phone=f"98765{student_data['student_id'][-3:]}"
#             )
#             db.session.add(student)
        
#         db.session.commit()
        
#         return jsonify({'message': 'Demo data initialized successfully'})
        
#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error initializing demo data: {str(e)}")
#         return jsonify({'error': 'Failed to initialize demo data'}), 500

# # Error handlers
# @app.errorhandler(404)
# def not_found(error):
#     return jsonify({'error': 'Endpoint not found'}), 404

# @app.errorhandler(500)
# def internal_error(error):
#     db.session.rollback()
#     return jsonify({'error': 'Internal server error'}), 500

# @jwt.expired_token_loader
# def expired_token_callback(jwt_header, jwt_payload):
#     return jsonify({'error': 'Token has expired'}), 401

# @jwt.invalid_token_loader
# def invalid_token_callback(error):
#     return jsonify({'error': 'Invalid token'}), 401

# @jwt.unauthorized_loader
# def missing_token_callback(error):
#     return jsonify({'error': 'Authorization token required'}), 401

# # Initialize database
# def create_tables():
#     with app.app_context():
#         db.create_all()
#         logger.info("Database tables created")




# def process_class_photo(image_data):
#     """Process class photo and detect all faces"""
#     try:
#         # Remove data URL prefix if present
#         if ',' in image_data:
#             image_data = image_data.split(',')[1]
            
#         # Decode base64 to image
#         image_bytes = base64.b64decode(image_data)
#         image = Image.open(io.BytesIO(image_bytes))
        
#         # Convert to RGB
#         if image.mode != 'RGB':
#             image = image.convert('RGB')
        
#         # Convert to numpy array
#         image_array = np.array(image)
        
#         # Find all faces
#         face_locations = face_recognition.face_locations(image_array)
#         face_encodings = face_recognition.face_encodings(image_array, face_locations)
        
#         return {
#             'face_locations': face_locations,
#             'face_encodings': face_encodings,
#             'total_faces': len(face_locations)
#         }
        
#     except Exception as e:
#         logger.error(f"Error processing class photo: {str(e)}")
#         return None

# def match_faces_to_students(face_encodings, class_name, school_id):
#     """Match detected faces to registered students"""
#     students = Student.query.filter_by(
#         class_name=class_name,
#         school_id=school_id,
#         is_active=True
#     ).all()
    
#     matches = []
#     unmatched_faces = []
    
#     for i, face_encoding in enumerate(face_encodings):
#         best_match = None
#         best_distance = float('inf')
        
#         for student in students:
#             if not student.face_encoding:
#                 continue
                
#             try:
#                 stored_encoding = np.array(json.loads(student.face_encoding))
#                 distance = face_recognition.face_distance([stored_encoding], face_encoding)[0]
                
#                 if distance < 0.6 and distance < best_distance:  # Threshold for match
#                     best_match = student
#                     best_distance = distance
#             except:
#                 continue
        
#         if best_match:
#             matches.append({
#                 'face_index': i,
#                 'student_id': best_match.id,
#                 'student_name': best_match.name,
#                 'student_id_number': best_match.student_id,
#                 'confidence': 1 - best_distance
#             })
#         else:
#             unmatched_faces.append({
#                 'face_index': i,
#                 'confidence': 0
#             })
    
#     return matches, unmatched_faces

# # Authentication Routes
# @app.route('/api/auth/login', methods=['POST'])
# def login():
#     try:
#         data = request.get_json()
#         email = data.get('email', '').lower().strip()
#         password = data.get('password', '')
        
#         if not email or not password:
#             return jsonify({'error': 'Email and password required'}), 400
        
#         user = User.query.filter_by(email=email, is_active=True).first()
        
#         if not user or not check_password_hash(user.password_hash, password):
#             return jsonify({'error': 'Invalid credentials'}), 401
        
#         # Create access token
#         access_token = create_access_token(identity=user.id)
        
#         # Prepare user info
#         user_info = {
#             'id': user.id,
#             'email': user.email,
#             'name': user.name,
#             'role': user.role,
#             'school_id': user.school_id,
#             'school_name': user.school.name if user.school else None,
#             'district_id': user.district_id,
#             'district_name': user.district.name if user.district else None
#         }
        
#         # Add teacher assignments if applicable
#         if user.role == 'teacher':
#             assignments = TeacherAssignment.query.filter_by(teacher_id=user.id).all()
#             user_info['assignments'] = [{
#                 'class_name': assignment.class_name,
#                 'subject': assignment.subject
#             } for assignment in assignments]
        
#         return jsonify({
#             'access_token': access_token,
#             'user': user_info
#         })
        
#     except Exception as e:
#         logger.error(f"Login error: {str(e)}")
#         return jsonify({'error': 'Login failed'}), 500

# @app.route('/api/auth/verify', methods=['GET'])
# @jwt_required()
# def verify_token():
#     try:
#         current_user_id = get_jwt_identity()
#         user = User.query.get(current_user_id)
        
#         if not user or not user.is_active:
#             return jsonify({'error': 'Invalid token'}), 401
        
#         return jsonify({'valid': True, 'user_id': user.id})
        
#     except Exception as e:
#         return jsonify({'error': 'Token verification failed'}), 401

# # Student Management Routes
# @app.route('/api/students', methods=['POST'])
# @require_role(['principal'])
# @require_school_access
# def add_student(user):
#     try:
#         data = request.get_json()
        
#         # Validate required fields
#         required_fields = ['name', 'student_id', 'class_name', 'guardian_name', 'guardian_phone', 'face_image']
#         for field in required_fields:
#             if not data.get(field):
#                 return jsonify({'error': f'{field} is required'}), 400
        
#         # Check if student ID already exists
#         existing = Student.query.filter_by(student_id=data['student_id']).first()
#         if existing:
#             return jsonify({'error': 'Student ID already exists'}), 400
        
#         # Process face image
#         face_encoding = encode_face_from_base64(data['face_image'])
#         if face_encoding is None:
#             return jsonify({'error': 'No face detected in image or invalid image format'}), 400
        
#         # Create student record
#         student = Student(
#             name=data['name'].strip(),
#             student_id=data['student_id'].strip(),
#             class_name=data['class_name'],
#             school_id=user.school_id,
#             guardian_name=data['guardian_name'].strip(),
#             guardian_phone=data['guardian_phone'].strip(),
#             health_notes=data.get('health_notes', '').strip(),
#             face_encoding=json.dumps(face_encoding.tolist())
#         )
        
#         db.session.add(student)
#         db.session.commit()
        
#         logger.info(f"Student {student.name} added by {user.name}")
        
#         return jsonify({
#             'message': 'Student added successfully',
#             'student_id': student.id
#         }), 201
        
#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error adding student: {str(e)}")
#         return jsonify({'error': 'Failed to add student'}), 500

# @app.route('/api/students/class/<class_name>', methods=['GET'])
# @require_role(['teacher', 'principal', 'district'])
# @require_school_access
# def get_class_students(user, class_name):
#     try:
#         # Build query based on user role
#         query = Student.query.filter_by(class_name=class_name, is_active=True)
        
#         if user.role == 'teacher':
#             # Teachers can only see students from their assigned classes
#             assignments = TeacherAssignment.query.filter_by(
#                 teacher_id=user.id,
#                 class_name=class_name
#             ).first()
#             if not assignments:
#                 return jsonify({'error': 'You are not assigned to this class'}), 403
#             query = query.filter_by(school_id=user.school_id)
#         elif user.role == 'principal':
#             query = query.filter_by(school_id=user.school_id)
#         # District users can see all students in their district
        
#         students = query.all()
        
#         students_data = []
#         for student in students:
#             students_data.append({
#                 'id': student.id,
#                 'name': student.name,
#                 'student_id': student.student_id,
#                 'class_name': student.class_name,
#                 'guardian_name': student.guardian_name,
#                 'guardian_phone': student.guardian_phone,
#                 'health_notes': student.health_notes,
#                 'school_name': student.school.name
#             })
        
#         return jsonify({'students': students_data})
        
#     except Exception as e:
#         logger.error(f"Error fetching students: {str(e)}")
#         return jsonify({'error': 'Failed to fetch students'}), 500

# # Attendance Routes
# @app.route('/api/attendance/capture', methods=['POST'])
# @require_role(['teacher', 'principal'])
# @require_school_access
# def capture_attendance(user):
#     try:
#         data = request.get_json()
        
#         if not data.get('class_name') or not data.get('image_data'):
#             return jsonify({'error': 'Class name and image data required'}), 400
        
#         class_name = data['class_name']
        
#         # Verify teacher has access to this class
#         if user.role == 'teacher':
#             assignment = TeacherAssignment.query.filter_by(
#                 teacher_id=user.id,
#                 class_name=class_name
#             ).first()
#             if not assignment:
#                 return jsonify({'error': 'You are not assigned to this class'}), 403
        
#         # Generate session ID
#         session_id = str(uuid.uuid4())
        
#         # Process the image
#         processing_result = process_class_photo(data['image_data'])
#         if not processing_result:
#             return jsonify({'error': 'Failed to process image'}), 400
        
#         # Create photo upload record
#         photo_upload = PhotoUpload(
#             session_id=session_id,
#             uploaded_by=user.id,
#             class_name=class_name,
#             school_id=user.school_id,
#             processing_status='processing',
#             detected_faces_count=processing_result['total_faces']
#         )
        
#         db.session.add(photo_upload)
#         db.session.commit()
        
#         # Match faces to students
#         matches, unmatched = match_faces_to_students(
#             processing_result['face_encodings'],
#             class_name,
#             user.school_id
#         )
        
#         # Store recognition results
#         results = {
#             'matches': matches,
#             'unmatched_faces': unmatched,
#             'total_faces_detected': processing_result['total_faces']
#         }
        
#         photo_upload.recognition_results = json.dumps(results)
#         photo_upload.processing_status = 'completed'
#         db.session.commit()
        
#         # Get all students in class for comparison
#         all_students = Student.query.filter_by(
#             class_name=class_name,
#             school_id=user.school_id,
#             is_active=True
#         ).all()
        
#         # Identify absent students
#         present_student_ids = [match['student_id'] for match in matches]
#         absent_students = [
#             {
#                 'id': student.id,
#                 'name': student.name,
#                 'student_id': student.student_id
#             }
#             for student in all_students 
#             if student.id not in present_student_ids
#         ]
        
#         return jsonify({
#             'session_id': session_id,
#             'total_students_in_class': len(all_students),
#             'faces_detected': processing_result['total_faces'],
#             'matches_found': len(matches),
#             'present_students': matches,
#             'absent_students': absent_students,
#             'unmatched_faces': unmatched
#         })
        
#     except Exception as e:
#         logger.error(f"Error processing attendance: {str(e)}")
#         return jsonify({'error': 'Failed to process attendance'}), 500

# @app.route('/api/attendance/confirm', methods=['POST'])
# @require_role(['teacher', 'principal'])
# def confirm_attendance(user):
#     try:
#         data = request.get_json()
#         session_id = data.get('session_id')
#         confirmations = data.get('confirmations', [])  # List of {student_id, status}
        
#         if not session_id:
#             return jsonify({'error': 'Session ID required'}), 400
        
#         # Verify session exists and user has access
#         photo_session = PhotoUpload.query.filter_by(session_id=session_id).first()
#         if not photo_session:
#             return jsonify({'error': 'Invalid session'}), 404
        
#         if photo_session.uploaded_by != user.id and user.role != 'principal':
#             return jsonify({'error': 'Access denied to this session'}), 403
        
#         # Delete existing records for this date and class (in case of re-submission)
#         today = datetime.utcnow().date()
#         AttendanceRecord.query.filter_by(
#             date=today,
#             session_id=session_id
#         ).delete()
        
#         # Create attendance records
#         records_created = 0
#         for confirmation in confirmations:
#             student_id = confirmation.get('student_id')
#             status = confirmation.get('status', 'present')
#             confidence = confirmation.get('confidence', 1.0)
            
#             if not student_id:
#                 continue
            
#             # Verify student exists and user has access
#             student = Student.query.get(student_id)
#             if not student:
#                 continue
                
#             if user.role == 'teacher':
#                 # Verify teacher is assigned to this student's class
#                 assignment = TeacherAssignment.query.filter_by(
#                     teacher_id=user.id,
#                     class_name=student.class_name
#                 ).first()
#                 if not assignment:
#                     continue
#             elif student.school_id != user.school_id:
#                 continue
            
#             record = AttendanceRecord(
#                 student_id=student_id,
#                 date=today,
#                 status=status,
#                 confidence_score=confidence,
#                 method='face_recognition',
#                 recorded_by=user.id,
#                 session_id=session_id
#             )
            
#             db.session.add(record)
#             records_created += 1
        
#         db.session.commit()
        
#         logger.info(f"Attendance confirmed for {records_created} students by {user.name}")
        
#         return jsonify({
#             'message': f'Attendance recorded for {records_created} students',
#             'records_created': records_created
#         })
        
#     except Exception as e:
#         db.session.rollback()
#         logger.error(f"Error confirming attendance: {str(e)}")
#         return jsonify({'error': 'Failed to confirm attendance'}), 500

# # Reporting Routes
# @app.route('/api/reports/daily/<date>', methods=['GET'])
# @require_role(['teacher', 'principal', 'district'])
# def daily_report(user, date):
#     try:
#         report_date = datetime.strptime(date, '%Y-%m-%d').date()
        
#         # Build query based on user role
#         query = db.session.query(AttendanceRecord, Student).join(Student)
#         query = query.filter(AttendanceRecord.date == report_date)
        
#         if user.role == 'teacher':
#             # Get teacher's assigned classes
#             assignments = TeacherAssignment.query.filter_by(teacher_id=user.id).all()
#             assigned_classes = [a.class_name for a in assignments]
#             query = query.filter(Student.class_name.in_(assigned_classes))
#             query = query.filter(Student.school_id == user.school_id)
#         elif user.role == 'principal':
#             query = query.filter(Student.school_id == user.school_id)
#         elif user.role == 'district':
#             query = query.filter(Student.school_id.in_(
#                 [school.id for school in user.district.schools]
#             ))
        
#         results = query.all()
        
#         report_data = []
#         for record, student in results:
#             report_data.append({
#                 'student_name': student.name,
#                 'student_id': student.student_id,
#                 'class_name': student.class_name,
#                 'status': record.status,
#                 'confidence_score': record.confidence_score,
#                 'method': record.method,
#                 'recorded_at': record.created_at.isoformat(),
#                 'school_name': student.school.name
#             })
        
#         return jsonify({
#             'date': date,
#             'total_records': len(report_data),
#             'records': report_data
#         })
        
#     except ValueError:
#         return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
#     except Exception as e:
#         logger.error(f"Error generating daily report: {str(e)}")
#         return jsonify({'error': 'Failed to generate report'}), 500

# @app.route('/api/reports/class/<class_name>/range', methods=['GET'])
# @require_role(['teacher', 'principal', 'district'])
# def class_range_report(user, class_name):
#     try:
#         start_date = request.args.get('start_date')
#         end_date = request.args.get('end_date')
        
#         if not start_date or not end_date:
#             return jsonify({'error': 'Start date and end date required'}), 400
        
#         start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
#         end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        
#         # Verify access to class
#         if user.role == 'teacher':
#             assignment = TeacherAssignment.query.filter_by(
#                 teacher_id=user.id,
#                 class_name=class_name
#             ).first()
#             if not assignment:
#                 return jsonify({'error': 'Access denied to this class'}), 403
        
#         # Build query
#         query = db.session.query(AttendanceRecord, Student).join(Student)
#         query = query.filter(Student.class_name == class_name)
#         query = query.filter(AttendanceRecord.date.between(start_date, end_date))
        
#         if user.role in ['teacher', 'principal']:
#             query = query.filter(Student.school_id == user.school_id)
#         elif user.role == 'district':
#             query = query.filter(Student.school_id.in_(
#                 [school.id for school in user.district.schools]
#             ))
        
#         results = query.all()
        
#         # Process results
#         student_attendance = {}
#         for record, student in results:
#             if student.id not in student_attendance:
#                 student_attendance[student.id] = {
#                     'student_name': student.name,
#                     'student_id': student.student_id,
#                     'total_days': 0,
#                     'present_days': 0,
#                     'absent_days': 0,
#                     'attendance_rate': 0
#                 }
            
#             student_attendance[student.id]['total_days'] += 1
#             if record.status == 'present':
#                 student_attendance[student.id]['present_days'] += 1
#             else:
#                 student_attendance[student.id]['absent_days'] += 1
        
#         # Calculate attendance rates
#         for student_id in student_attendance:
#             data = student_attendance[student_id]
#             if data['total_days'] > 0:
#                 data['attendance_rate'] = round(
#                     (data['present_days'] / data['total_days']) * 100, 2
#                 )
        
#         return jsonify({
#             'class_name': class_name,
#             'start_date': start_date.isoformat(),
#             'end_date': end_date.isoformat(),
#             'student_attendance': list(student_attendance.values())
#         })
        
#     except ValueError:
#         return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
#     except Exception as e:
#         logger.error(f"Error generating class range report: {str(e)}")
#         return jsonify({'error': 'Failed to generate class range report'}), 500

# def create_tables():
#     with app.app_context():
#         db.create_all()
#         logger.info("Database tables created")

# @app.route('/api/debug-token')
# @jwt_required()
# def debug_token():
#     from flask_jwt_extended import get_jwt
#     return jsonify(get_jwt()), 200


# if __name__ == '__main__':
#     create_tables()
#     app.run(debug=True, host='0.0.0.0', port=5001)