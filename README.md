# ClubCentric: Campus Club Collaboration Platform

## Overview

ClubCentric is a full-stack web application designed to streamline collaboration between campus clubs and organizations. The platform enables club organizers to manage events, calendars, documents, and memberships while facilitating inter-club collaboration and event planning.

## Roles

- **Lead Architect:** ArthurHenrique Ferreira  
- **Project Organizer:** Lauren Harman  
- **User Interface Designer:** Liam McLoughlin  
- **Quality Assurance Lead:** Marcos Carvajal  
- **(Unofficial) Backend Developer:** Raymond Pridgen 

**Main User Story:**

> I am a club president, and I want to schedule and plan an event with another club president, so that we can promote inter-club collaboration easier.

**Sub User Stories:**

Currently, the team is focused on having
- a calendar view for streamlining in a GTD manner and club collaborative, 
- analytics view for improving quality of event, 
- recruitment view with integrated networking, 
- club demo view, 
- dues management view, 
- and advanced search engine based on common interest analytics. 


---

## Table of Contents

1. [Tech Stack](#tech-stack)  
2. [Prerequisites](#prerequisites)  
3. [Setup & Installation](#setup--installation)  
4. [Configuration](#configuration)  
5. [Running the App](#running-the-app)  
6. [Testing](#testing)  
7. [Deployment](#deployment)  
8. [Architecture / Workflow](#architecture--workflow)  
9. [Roadmap](#roadmap)  
10. [Contributing](#contributing)  
11. [License](#license)  
12. [Acknowledgments](#acknowledgments)  
13. [Contact / Support](#contact--support)  

---

## Tech Stack

### Backend
- Framework: Django 5.2.7
- API: Django REST Framework 3.16.1
- Database: PostgreSQL with psycopg2-binary 2.9.11
- Authentication: Django session-based authentication with CSRF protection
- CORS: django-cors-headers 4.9.0
- File uploads: Pillow 12.0.0

### Frontend
- Framework: React 19.1.1
- Build tool: Vite 7.1.5
- Routing: React Router DOM 7.9.1
- HTTP client: Axios 1.12.2
- UI components: Material-UI 7.3.3
- Calendar: FullCalendar 6.1.19
- Styling: TailwindCSS 4.1.17 with Emotion

---

## Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.10 or higher
- Node.js 16 or higher with npm
- PostgreSQL 13 or higher
- Git
- A code editor such as VS Code or similar

---

## Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourorg/clubcentric.git
cd clubcentric
```

### 2. Database Setup

Create a PostgreSQL database for the project:

```bash
psql -U postgres
CREATE DATABASE clubcentric;
CREATE USER clubcentric_user WITH PASSWORD 'your_password';
ALTER ROLE clubcentric_user SET client_encoding TO 'utf8';
ALTER ROLE clubcentric_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE clubcentric_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE clubcentric TO clubcentric_user;
\q
```

### 3. Backend Setup

```bash
cd backend

# create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# install dependencies
pip install -r requirements.txt

# create environment file
touch .env
```

Edit the `.env` file with your database credentials:

```
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_NAME=clubcentric
DATABASE_USER=clubcentric_user
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
```

Run migrations and create a superuser:

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 4. Frontend Setup

```bash
cd ../frontend

# install dependencies
npm install

# create environment file
touch .env
```

Edit the `.env` file:

```
VITE_API_URL=http://localhost:8000
```

---

## Configuration

### Backend Configuration

The backend uses environment variables for configuration. Key settings include:

- DEBUG: Set to True for development, False for production
- SECRET_KEY: Django secret key for cryptographic signing
- DATABASE_NAME: PostgreSQL database name
- DATABASE_USER: PostgreSQL username
- DATABASE_PASSWORD: PostgreSQL password
- DATABASE_HOST: Database host (default: localhost)
- DATABASE_PORT: Database port (default: 5432)
- ALLOWED_HOSTS: Comma-separated list of allowed hostnames

### Frontend Configuration

The frontend uses Vite environment variables:

- VITE_API_URL: Backend API base URL (default: http://localhost:8000)

### CORS Configuration

The backend is configured to accept requests from:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (alternative frontend port)

Modify `backend/myproject/settings.py` to adjust CORS settings for production.

---

## Running the Application

### Development Mode

Start the backend server:

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
```

The backend will be available at http://localhost:8000

In a separate terminal, start the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:5173

### Accessing the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

---

## Project Architecture

### Backend Structure

The backend follows Django's app-based architecture:

```
backend/
├── myproject/              # Main project configuration
│   ├── settings.py         # Django settings
│   ├── urls.py            # URL routing configuration
│   └── wsgi.py            # WSGI application entry point
├── users/                  # User management app
│   ├── models.py          # User model
│   ├── views.py           # User-related views
│   └── urls.py            # User API endpoints
├── clubs/                  # Club management app
│   ├── models.py          # Club and Membership models
│   ├── views.py           # Club CRUD operations
│   └── urls.py            # Club API endpoints
├── calendar_app/           # Calendar and meeting management
│   ├── models.py          # Calendar and Meeting models
│   ├── views.py           # Calendar CRUD and permissions
│   └── urls.py            # Calendar API endpoints
├── document/               # Document manager app
│   ├── models.py          # DocumentManager and Document models
│   ├── views.py           # Document upload and management
│   └── urls.py            # Document API endpoints
└── media/                  # User-uploaded files storage

```

### Frontend Structure

The frontend uses a component-based React architecture:

```
frontend/
├── src/
│   ├── components/
│   │   ├── navbar/        # Navigation component
│   │   ├── clubs/         # Club-related components
│   │   ├── calendars/     # Calendar components
│   │   ├── !card/         # Reusable card components
│   │   ├── !form/         # Form components for CRUD operations
│   │   └── !base/         # Base UI components
│   ├── pages/             # Page-level components
│   │   ├── HomePage.jsx
│   │   ├── ClubPage.jsx
│   │   ├── ClubSearchPage.jsx
│   │   └── CalendarPage.jsx
│   ├── services/          # API service layer
│   │   ├── api.js         # Axios instance configuration
│   │   ├── userService.js
│   │   ├── clubService.js
│   │   ├── calendarService.js
│   │   └── documentService.js
│   ├── utils/             # Utility functions
│   │   └── cookies.js     # CSRF token handling
│   └── App.jsx            # Main application component
└── public/                # Static assets

```

### Data Models

#### User Model
- Extends Django's AbstractUser
- Fields: username, email, first_name, last_name, bio, pfp
- Relationships: clubs (through Membership), calendars, document_managers

#### Club Model
- Fields: name, description, image
- Relationships: members (through Membership), calendars, document_managers

#### Membership Model
- Links users to clubs with roles
- Roles: organizer, member
- Fields: user, club, role, joined_at

#### Calendar Model
- Can belong to either a user or a club
- Fields: name, club (nullable), user (nullable)
- Relationships: meetings

#### Meeting Model
- Belongs to a calendar
- Fields: calendar, date, description

#### DocumentManager Model
- Can belong to either a user or a club
- Fields: name, club (nullable), user (nullable)
- Relationships: documents

#### Document Model
- Belongs to a document manager
- Fields: title, file, uploaded_at, document_manager

### API Endpoints

#### User Endpoints
- POST /user/login/ - User login
- POST /user/logout/ - User logout
- POST /user/register/ - User registration
- GET /user/get/ - Get user details
- POST /user/update/ - Update user profile
- POST /user/delete/ - Delete user account

#### Club Endpoints
- POST /clubs/create/ - Create a club
- GET /clubs/get/ - Get club details
- GET /clubs/list/ - List all clubs
- POST /clubs/update/ - Update club information
- POST /clubs/delete/ - Delete a club

#### Membership Endpoints
- POST /clubs/membership/create/ - Join a club
- GET /clubs/membership/get/ - Get membership details
- POST /clubs/membership/update/ - Update membership role
- POST /clubs/membership/delete/ - Leave a club

#### Calendar Endpoints
- POST /calendar/create/ - Create a calendar
- GET /calendar/get/ - Get calendars (user or club)
- POST /calendar/update/ - Update calendar
- POST /calendar/delete/ - Delete calendar

#### Meeting Endpoints
- POST /calendar/meetings/create/ - Create a meeting
- GET /calendar/meetings/list/ - List meetings for a calendar
- POST /calendar/meetings/update/ - Update meeting
- POST /calendar/meetings/delete/ - Delete meeting

#### Document Manager Endpoints
- POST /documents/managers/create/ - Create document manager
- GET /documents/managers/get/ - Get document managers
- POST /documents/managers/update/ - Update manager
- POST /documents/managers/delete/ - Delete manager

#### Document Endpoints
- POST /documents/upload/ - Upload a document
- GET /documents/get/ - Get documents
- POST /documents/delete/ - Delete document

### Authentication and Permissions

The application uses Django's session-based authentication with CSRF protection:

- Login required: Most endpoints require authentication
- Role-based access: Organizers have additional permissions for club operations
- CSRF tokens: Required for all POST requests
- Membership verification: Users must be club members to access club resources

---

## Testing

Backend testing is currently in development. To run tests when available:

```bash
cd backend
python manage.py test
```

Frontend testing with Jest/Vitest:

```bash
cd frontend
npm test
```

---

## Features and Roadmap

### Current Features

- User authentication and profile management
- Club creation and management
- Membership system with role-based permissions (organizer, member)
- Calendar management for users and clubs
- Meeting scheduling and management
- Document manager system for organizing files
- Document upload and storage
- Club search and discovery
- Inter-club collaboration tools

### Planned Features

- Event collaboration between multiple clubs
- Analytics dashboard for event quality metrics
- Recruitment and networking tools
- Club dues management system
- Advanced search based on common interest analytics
- Email notifications for events and updates
- Mobile-responsive design improvements
- Export functionality for calendars and documents

---

## Development Workflow

### Git Workflow

The project follows a feature branch workflow:

1. Clone the repository and create a new branch from main
2. Name branches descriptively: feature/calendar-view, fix/login-bug, etc.
3. Make commits with clear, descriptive messages
4. Push your branch and open a pull request
5. Request review from a team member
6. Address feedback and merge when approved

### Code Style

Backend (Python):
- Follow PEP 8 style guidelines
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Keep views focused on a single responsibility

Frontend (JavaScript/React):
- Use functional components with hooks
- Keep components small and reusable
- Use consistent naming conventions (PascalCase for components)
- Add comments for complex logic

---

## Troubleshooting

### Common Issues

#### Database Connection Error

If you encounter database connection errors:
- Verify PostgreSQL is running: sudo service postgresql status
- Check database credentials in .env file
- Ensure the database exists: psql -U postgres -l

#### CORS Errors

If the frontend cannot connect to the backend:
- Verify CORS_ALLOWED_ORIGINS in backend/myproject/settings.py
- Check that VITE_API_URL in frontend/.env matches the backend URL
- Ensure both servers are running

#### Migration Errors

If migrations fail:
- Delete all migration files except __init__.py in each app's migrations folder
- Drop and recreate the database
- Run python manage.py makemigrations followed by python manage.py migrate

#### Port Already in Use

If port 8000 or 5173 is already in use:
- Backend: python manage.py runserver 8001 (or any available port)
- Frontend: Edit vite.config.js to change the port
- Update VITE_API_URL accordingly

---

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch with a descriptive name
3. Make your changes with clear commit messages
4. Ensure all existing tests pass
5. Add tests for new features if applicable
6. Update documentation as needed
7. Submit a pull request with a clear description

For major changes, please open an issue first to discuss the proposed changes.

---

## License

This project is developed as part of an academic course at Stevens Institute of Technology.

---

## Team Contact

For questions or support, contact the development team:

- Lead Architect: ArthurHenrique Ferreira
- Project Organizer: Lauren Harman
- User Interface Designer: Liam McLoughlin
- Quality Assurance Lead: Marcos Carvajal
- Backend Developer: Raymond Pridgen

For bug reports, please create an issue in the GitHub repository.
