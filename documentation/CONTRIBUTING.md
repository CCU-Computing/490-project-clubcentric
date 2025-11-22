# Contributing to ClubCentric

We welcome contributions! This document provides guidelines for contributing to the ClubCentric project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [API Documentation](#api-documentation)

---

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

---

## Getting Started

### Prerequisites

Choose one of the following setup methods:

**Option 1: Docker (Recommended)**
- Docker Desktop installed
- Git

**Option 2: Manual Setup**
- Python 3.12+
- Node.js 22+
- PostgreSQL 16+
- Git

### Setup Instructions

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/clubcentric.git
   cd clubcentric
   ```

2. **Choose Your Setup Method**

   **Docker:**
   ```bash
   docker-compose up --build
   ```
   See [DOCKER_README.md](DOCKER_README.md) for details.

   **Manual:**
   - Follow setup instructions in [README.md](README.md)
   - Set up backend, frontend, and database separately

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/club-merge-system`)
- `fix/` - Bug fixes (e.g., `fix/login-authentication`)
- `refactor/` - Code refactoring (e.g., `refactor/api-endpoints`)
- `docs/` - Documentation updates (e.g., `docs/api-reference`)
- `test/` - Test additions/updates (e.g., `test/club-crud`)

### Workflow Steps

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make Changes**
   - Write clean, documented code
   - Follow coding standards (see below)
   - Add tests for new functionality

3. **Test Your Changes**
   ```bash
   # Backend tests
   cd backend
   python manage.py test

   # Frontend tests
   cd frontend
   npm test
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of changes"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature
   ```

6. **Open a Pull Request**
   - Go to the main repository
   - Click "New Pull Request"
   - Provide a clear description
   - Link related issues

---

## Coding Standards

### Backend (Python/Django)

**Style Guide:**
- Follow [PEP 8](https://pep8.org/) style guidelines
- Use 4 spaces for indentation
- Maximum line length: 100 characters
- Use meaningful variable and function names

**Best Practices:**
- Add docstrings to functions and classes
- Keep views focused on a single responsibility
- Use Django's built-in features (ORM, authentication, etc.)
- Handle errors gracefully with appropriate HTTP status codes
- Validate all user inputs

**Example:**
```python
@login_required
@require_POST
def create_club(request):
    """
    Create a new club with the authenticated user as organizer.

    Required fields: club_name, club_description
    Returns: {"status": True, "id": club.id} on success
    """
    club_name = request.POST.get("club_name")
    club_description = request.POST.get("club_description")

    if not club_name or not club_description:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    # ... rest of implementation
```

**Tools:**
- Use `black` for code formatting: `black .`
- Use `flake8` for linting: `flake8`
- Use `isort` for import sorting: `isort .`

### Frontend (JavaScript/React)

**Style Guide:**
- Use ES6+ syntax
- 2 spaces for indentation
- Use single quotes for strings
- Semicolons at end of statements

**Best Practices:**
- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and variable names
- Use PascalCase for components, camelCase for functions/variables
- Add comments for complex logic
- Handle errors with try-catch blocks

**Example:**
```javascript
export const ClubCard = ({ club, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinClub = async () => {
    setError('');
    setIsLoading(true);

    try {
      const result = await join_club(club.id);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message || 'Failed to join club');
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of component
};
```

**Tools:**
- Use ESLint for linting: `npm run lint`
- Use Prettier for formatting: `npm run format`

---

## Commit Guidelines

### Commit Message Format

Use clear, descriptive commit messages with the following format:

```
Type: Brief description (50 chars or less)

Optional detailed description explaining:
- Why the change was needed
- What approach was taken
- Any side effects or related changes

Refs: #issue-number (if applicable)
```

### Commit Types

- `Add:` - New feature or functionality
- `Fix:` - Bug fix
- `Update:` - Changes to existing functionality
- `Refactor:` - Code restructuring without behavior change
- `Docs:` - Documentation only changes
- `Test:` - Adding or updating tests
- `Style:` - Formatting, missing semicolons, etc.
- `Chore:` - Maintenance tasks, dependency updates

### Examples

**Good commits:**
```
Add: Club merge request system

Implements the ability for clubs to send merge requests to other clubs.
Both clubs must accept before the merge is completed. Includes validation
to prevent re-merging already merged clubs.

Refs: #42
```

```
Fix: Authentication race condition on logout

Changed logout endpoint to not require @login_required decorator,
preventing 404 redirects. Updated AuthContext to explicitly set
isAuthenticated to false on errors.

Refs: #58
```

**Bad commits:**
```
fixed stuff
```

```
update code
```

---

## Pull Request Process

### Before Submitting

1. **Update Your Branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout feature/your-feature
   git rebase main
   ```

2. **Run All Tests**
   - Ensure all existing tests pass
   - Add tests for new functionality
   - Test manually if applicable

3. **Update Documentation**
   - Update README.md if needed
   - Add/update API documentation
   - Update CHANGELOG.md with your changes

### Pull Request Template

When creating a PR, include:

**Title:** Brief, descriptive title

**Description:**
```markdown
## Summary
Brief description of what this PR does

## Changes
- List of specific changes
- Each change on its own line

## Testing
How to test these changes

## Related Issues
Closes #issue-number
```

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge your PR
4. Delete your feature branch after merge

---

## Testing

### Backend Testing

**Run all tests:**
```bash
cd backend
python manage.py test
```

**Run specific app tests:**
```bash
python manage.py test clubs
python manage.py test users
python manage.py test calendar_app
python manage.py test document
```

**Test structure:**
```python
from django.test import TestCase
from clubs.models import Club

class ClubTestCase(TestCase):
    def setUp(self):
        """Set up test data"""
        self.club = Club.objects.create(
            name="Test Club",
            description="Test Description"
        )

    def test_club_creation(self):
        """Test that club is created correctly"""
        self.assertEqual(self.club.name, "Test Club")
```

### Frontend Testing

**Run all tests:**
```bash
cd frontend
npm test
```

**Test structure:**
```javascript
import { render, screen } from '@testing-library/react';
import { ClubCard } from './ClubCard';

describe('ClubCard', () => {
  it('renders club name', () => {
    const club = { name: 'Test Club' };
    render(<ClubCard club={club} />);
    expect(screen.getByText('Test Club')).toBeInTheDocument();
  });
});
```

---

## API Documentation

### Adding New Endpoints

When adding new API endpoints:

1. **Update models** (if needed):
   - Add/modify models in `backend/<app>/models.py`
   - Create and run migrations

2. **Create views**:
   - Add views in `backend/<app>/views.py`
   - Include appropriate decorators (`@login_required`, `@require_POST`, etc.)
   - Add proper error handling
   - Return appropriate HTTP status codes

3. **Update URLs**:
   - Add URL patterns in `backend/<app>/urls.py`
   - Follow existing naming conventions

4. **Create frontend service**:
   - Add service function in `frontend/src/services/<serviceName>.js`
   - Handle errors appropriately
   - Use FormData for file uploads

5. **Update documentation**:
   - Add endpoint to README.md API section
   - Include request/response examples
   - Document all parameters and return values

### API Documentation Format

```markdown
#### Endpoint Name
- `METHOD /path/to/endpoint/` - Brief description
  - **Auth Required**: Yes/No
  - **Permissions**: List permissions needed
  - **Parameters**:
    - `param1` (type, required/optional): Description
    - `param2` (type, required/optional): Description
  - **Returns**: Description of response
  - **Errors**:
    - `400`: Description
    - `403`: Description
    - `404`: Description
```

---

## Project Structure

```
clubcentric/
├── README.md                  # Main project documentation
├── CONTRIBUTING.md            # This file
├── CODE_OF_CONDUCT.md        # Code of conduct
├── CHANGELOG.md              # Version history
├── QUICKSTART.md             # Quick setup guide
├── DOCKER_README.md          # Docker setup guide
├── docker-compose.yml        # Docker configuration
├── backend/                  # Django backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── myproject/           # Project settings
│   ├── users/               # User app
│   ├── clubs/               # Club app
│   ├── calendar_app/        # Calendar app
│   ├── document/            # Document app
│   └── media/               # Uploaded files
└── frontend/                # React frontend
    ├── package.json
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   └── utils/          # Utility functions
    └── public/             # Static assets
```

---

## Questions or Issues?

If you have questions or run into issues:

1. Check existing [issues](https://github.com/yourorg/clubcentric/issues)
2. Read the [README.md](README.md) and other documentation
3. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

---

## Thank You!

Thank you for contributing to ClubCentric! Your efforts help make campus club collaboration easier for everyone.
