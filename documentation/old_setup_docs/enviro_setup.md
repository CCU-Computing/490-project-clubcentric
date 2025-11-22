1. Install prerequisites
Make sure you have installed:
•	VS Code
•	Python (3.10+)
•	Node.js (latest LTS)
•	MangoDB 
<!-- (FIXME: Pending MangoDB Version) -->
•	Git (for version control)
________________________________________
2. Set up project structure
Inside VS Code terminal:
mkdir club-collab-app
cd club-collab-app
________________________________________
3. Create Django backend
# Create and activate virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install Django + REST + CORS Headers (WHILE INSIDE THE VENV)
pip install django djangorestframework
pip install django-cors-headers 

# Create a new project in Django (while in the /backend folder)
django-admin startproject backend
cd backend

# Run migrations + test (while in the /backend folder)
python manage.py migrate
python manage.py runserver
👉 Visit http://127.0.0.1:8000 to confirm it works.
💡 In VS Code: Select the venv under Python: Select Interpreter.
________________________________________

<!-- FIXME: Pending MangoDB Changes go here -->
<!-- 4. Configure PostgreSQL in Django
Edit backend/settings.py:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'clubdb',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
} -->

Then:
python manage.py migrate
________________________________________

# 5. Set up React frontend
In a new VS Code terminal (keep backend running):

    cd ..
    npx create-react-app frontend
    cd /frontend
    npm start

    Install React Router and Packages:
    npm i react-router 
    npm install @mui/material @emotion/react @emotion/styled
    npm install @mui/icons-material 

👉 React will run on http://localhost:3000.
________________________________________
6. Connect React to Django REST
•	Install Django CORS headers:
•	pip install django-cors-headers

<!-- FIXME: I am not sure the below text is necessary -->
<!-- •	Add to INSTALLED_APPS + MIDDLEWARE in settings.py.
•	In React (frontend/src/App.js), fetch data from Django API:
•	useEffect(() => {
•	  fetch("http://127.0.0.1:8000/api/events/")
•	    .then(res => res.json())
•	    .then(data => console.log(data));
•	}, []); -->
________________________________________
7. Run both simultaneously
•	Terminal 1:
•	cd backend
•	python manage.py runserver
•	Terminal 2:
•	cd frontend
•	npm start
________________________________________
8. Version control with GitHub
git init
git add .
git commit -m "Initial commit: Django + React + Postgres setup"
git branch -M main
git remote add origin https://github.com/yourusername/club-collab-app.git
git push -u origin main