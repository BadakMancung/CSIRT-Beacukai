# CSIRT Bea Cukai Website

## Overview
A comprehensive web application for CSIRT (Computer Security Incident Response Team) Bea Cukai built with Laravel (backend) and React with Inertia.js (frontend).

## Features

### Public Pages
- **Home (Beranda)** - `/` - Homepage with latest articles and events
- **About (Profil)** - `/profil` - Organization profile with vision and mission
- **Services (Layanan)** - `/layanan` - Available CSIRT services
- **Events** - `/event` - Upcoming and past events
- **Articles** - `/artikel` - News and articles
- **Contact (Hubungi Kami)** - `/hubungi-kami` - Contact information and location
- **RFC2350** - `/rfc2350` - CSIRT service description standard

### Admin Panel
Accessible at `/dashboard` (requires authentication)

#### Article Management
- **List Articles** - `/articles` - View all articles with pagination
- **Create Article** - `/articles/create` - Create new articles
- **View Article** - `/articles/{id}` - View article details
- **Edit Article** - `/articles/{id}/edit` - Edit existing articles
- **Delete Article** - Delete functionality with confirmation

#### Event Management  
- **List Events** - `/events` - View all events with pagination
- **Create Event** - `/events/create` - Create new events
- **View Event** - `/events/{id}` - View event details
- **Edit Event** - `/events/{id}/edit` - Edit existing events
- **Delete Event** - Delete functionality with confirmation

## Technical Stack

### Backend (Laravel)
- **Framework**: Laravel 11.x
- **Database**: SQLite (for development)
- **Authentication**: Laravel Breeze
- **File Storage**: Laravel Storage (with symlink)

### Frontend (React + Inertia.js)
- **Framework**: React 18.x
- **Router**: Inertia.js
- **Styling**: TailwindCSS
- **Build Tool**: Vite

## Database Schema

### Articles Table
- `id` - Primary key
- `title` - Article title
- `content` - Article content
- `excerpt` - Brief summary
- `featured_image` - Image path
- `status` - draft/published
- `published_at` - Publication date
- `created_at` & `updated_at` - Timestamps

### Events Table
- `id` - Primary key
- `title` - Event title
- `description` - Event description
- `location` - Event location
- `event_date` - Start date and time
- `end_date` - End date and time
- `registration_url` - Registration link
- `max_participants` - Maximum attendees
- `featured_image` - Event image
- `status` - upcoming/ongoing/completed/cancelled
- `created_at` & `updated_at` - Timestamps

## Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- NPM

### Installation
1. Clone the repository
2. Install PHP dependencies: `composer install`
3. Install Node dependencies: `npm install`
4. Copy environment file: `cp .env.example .env`
5. Generate application key: `php artisan key:generate`
6. Run migrations: `php artisan migrate`
7. Seed database: `php artisan db:seed`
8. Create storage symlink: `php artisan storage:link`

### Development
1. Start Laravel server: `php artisan serve`
2. Start Vite dev server: `npm run dev`
3. Access the application at `http://localhost:8000`

## Key Components

### Models
- `Article` - Article management with scopes for published content
- `Event` - Event management with status handling
- `User` - User authentication (Laravel Breeze)

### Controllers
- `PublicController` - Handles all public-facing pages
- `ArticleController` - Full CRUD for articles
- `EventController` - Full CRUD for events

### Frontend Layouts
- `PublicLayout` - Layout for public pages with navigation
- `AuthenticatedLayout` - Layout for admin pages with navigation

### Key Features Implemented
- Responsive design with TailwindCSS
- Image upload and storage handling
- Date/time formatting for forms and display
- Pagination for content lists
- Status management (draft/published for articles, upcoming/completed for events)
- Search and filtering capabilities
- Form validation and error handling

## Admin Access
Create an admin user account through Laravel Breeze registration, then access:
- Dashboard: `/dashboard`
- Articles: `/articles`
- Events: `/events`

## Public Access
All public pages are accessible without authentication:
- Home: `/`
- Articles: `/public/articles`
- Events: `/public/events`
- Other public pages as listed above

## File Structure
```
app/
├── Http/Controllers/
│   ├── ArticleController.php
│   ├── EventController.php
│   └── PublicController.php
├── Models/
│   ├── Article.php
│   └── Event.php
database/
├── migrations/
├── seeders/
resources/
├── js/
│   ├── Layouts/
│   │   ├── PublicLayout.jsx
│   │   └── AuthenticatedLayout.jsx
│   └── Pages/
│       ├── Public/
│       └── Admin/
routes/
└── web.php
```

## Future Enhancements
- Contact form backend implementation
- Email notifications
- User role management
- Content moderation
- SEO optimization
- Performance caching
- API endpoints for mobile apps
