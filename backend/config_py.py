import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    JWT_SECRET_KEY = SECRET_KEY

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # File upload settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max
    UPLOAD_FOLDER = 'uploads'
    
    # Face recognition settings
    FACE_RECOGNITION_TOLERANCE = 0.6
    FACE_DETECTION_MODEL = 'hog'  # or 'cnn' for better accuracy but slower
    
    # SMS settings (for future integration)
    # In config.py, inside the Config class



class DevelopmentConfig(Config):
    DEBUG = True
    # In config.py, inside the DevelopmentConfig class
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:atharva@localhost:5432/attendance_db'


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://user:password@localhost/attendance_prod'

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///attendance_test.db'
    WTF_CSRF_ENABLED = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}