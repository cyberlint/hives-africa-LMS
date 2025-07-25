Analytix Hive LMS - Authentication Setup Guide
This guide covers the complete setup and configuration of the aligned frontend and backend authentication system.

🏗️ Architecture Overview
Backend (Django)
Framework: Django 4.2.7 with Django REST Framework
Authentication: Custom authentication views with Django Allauth integration
Token System: Django REST Framework Token Authentication
User Model: Custom User model with email as primary identifier
Email Verification: Django Allauth email verification system
Frontend (Next.js)
Framework: Next.js 15 with TypeScript
State Management: React Context API with custom AuthContext
API Client: Axios with interceptors for token management
Validation: Zod schemas for form validation
UI: Tailwind CSS with shadcn/ui components
🚀 Quick Start
Prerequisites
Python 3.8+
Node.js 18+
PostgreSQL (optional, SQLite works for development)
Redis (for Celery and Channels)
Backend Setup
Navigate to backend directory

cd backend-codes
Create virtual environment

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies

pip install -r requirements.txt
Environment configuration

cp .env.example .env
# Edit .env with your configuration
Database migrations

python manage.py makemigrations
python manage.py migrate
Create superuser

python manage.py createsuperuser
Run development server

python manage.py runserver
Frontend Setup
Navigate to frontend directory

cd frontend-codes
Install dependencies

npm install
Environment configuration

cp .env.example .env.local
# Edit .env.local with your configuration
Run development server

npm run dev
🔧 Configuration Details
Backend Configuration
Environment Variables (.env)
# Django Core
SECRET_KEY=your-super-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database
DATABASE_URL=sqlite:///db.sqlite3

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Email (for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
Key Settings (settings/base.py)
Custom User Model: AUTH_USER_MODEL = 'users.User'
Authentication: Token + Session authentication
Email verification: Mandatory (configurable)
CORS: Configured for localhost:3000
Frontend Configuration
Environment Variables (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000

Key Components
AuthContext: Manages global authentication state
API Client: Handles requests with automatic token injection
Route Protection: Automatic redirects for protected routes
