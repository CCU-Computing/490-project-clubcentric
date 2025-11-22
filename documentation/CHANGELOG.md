# Changelog

All notable changes to the ClubCentric project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Club Merge System**: Complete merge request workflow allowing clubs to merge into partnerships
  - Multiple concurrent merge requests per club
  - Two-stage acceptance process (both clubs must accept)
  - Automatic member transfer to merged club
  - Validation to prevent re-merging already merged clubs
- **Mirror Calendar System**: Automatic calendar synchronization for club members
  - Mirror calendars created when joining a club
  - Auto-sync meetings from all club calendars
  - Mirror calendars deleted when leaving club
  - Read-only protection on mirror meetings
- **Leave Club Functionality**: Members can now leave clubs they've joined
  - Removes membership
  - Deletes associated mirror calendar
  - Organizers can remove members (but not other organizers)
- **Enhanced Club Profiles**:
  - Club display pictures with upload validation
  - Summary field for brief club descriptions
  - Video embed support (YouTube, etc.)
  - Links array for external resources
  - Tags array for categorization
  - Last meeting date tracking
- **Profile Pictures**: User profile picture upload and display
- **File Upload Validation**:
  - Size limits (10MB for images)
  - File type validation (JPEG, PNG, GIF, WebP)
  - Better error messages for invalid uploads
- **Enhanced API Responses**: All file URLs now use absolute paths for proper frontend display
- **Docker Support**: Full containerization with docker-compose setup
- **Comprehensive Documentation**:
  - QUICKSTART.md for fast setup
  - DOCKER_README.md for Docker-specific information
  - Updated README.md with complete API documentation

### Changed
- **Authentication Flow**: Improved logout behavior
  - Removed `@login_required` from logout endpoint to prevent 404 redirects
  - Changed `get_user_data` to return 401 instead of redirecting
  - Fixed race conditions in authentication state updates
- **Navbar**: Now only visible when user is authenticated
- **App Routing**: Cleaner conditional rendering based on auth state
- **Merge Request View**: Returns arrays of all merge requests instead of single object
- **Merge Request Validation**: More permissive rules allowing concurrent merge negotiations
- **File URL Generation**: All media URLs safely generated with error handling
- **Error Messages**: More descriptive error messages across all endpoints

### Fixed
- **Authentication Issues**:
  - Fixed 404 errors on logout
  - Fixed authentication state race conditions
  - Added missing `@login_required` decorator to `view_clubs` endpoint
- **File Upload Issues**:
  - Fixed 500 errors when uploading club pictures
  - Safe handling of missing or invalid file paths
  - Proper FormData handling for file uploads
- **Document URL Generation**: Safe file URL building with fallback for missing files
- **Club Picture Display**: Fixed absolute URL generation for club display pictures
- **Merge Request Card**: Fixed contrast and formatting issues
- **Permission Errors**: Consistent permission checks across all endpoints

### Security
- Added comprehensive file upload validation
- Enhanced permission checks for all operations
- Proper CSRF protection on all mutation endpoints
- Safe file URL generation preventing path traversal
- Validation to prevent editing/deleting mirror meetings

## [0.1.0] - Initial Release

### Added
- User authentication system (registration, login, logout)
- User profile management
- Club creation and management
- Membership system with roles (organizer, member)
- Calendar system for users and clubs
- Meeting scheduling and management
- Document manager system
- Document upload and storage
- Basic search functionality
- REST API with Django REST Framework
- React frontend with Material-UI
- PostgreSQL database integration
- Session-based authentication with CSRF protection
- CORS configuration for frontend-backend communication

### Backend Features
- Django 5.2.7 framework
- PostgreSQL database with psycopg2
- Django REST Framework for API
- Session-based authentication
- File upload support with Pillow
- Multi-app architecture (users, clubs, calendar_app, document)

### Frontend Features
- React 19.1.1 with Vite
- Material-UI components
- React Router for navigation
- Axios for HTTP requests
- FullCalendar for calendar views
- TailwindCSS for styling
- Cookie-based CSRF token handling

---

## Version History

- **Current**: Development version with merge system, mirror calendars, and enhanced features
- **0.1.0**: Initial release with core functionality
