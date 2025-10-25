# Class Scheduling Service

A Node.js/Express backend API for the Class Scheduling System.

## Features

- RESTful API for class scheduling operations
- MongoDB database integration
- CSV upload and processing
- Student, instructor, and class management
- Reporting and analytics endpoints
- Configuration management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
CLASS_DURATION=45
MAX_STUDENT_CLASSES_PER_DAY=3
MAX_INSTRUCTOR_CLASSES_PER_DAY=5
MAX_CLASSES_PER_TYPE=10
```

3. Run database setup:
```bash
npm run setup
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at [http://localhost:5001](http://localhost:5001).

## Available Scripts

- `npm run dev` - Runs the server with nodemon (development)
- `npm start` - Runs the server in production mode
- `npm run setup` - Initializes the database with sample data
- `npm test` - Runs tests (placeholder)

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

### Instructors
- `GET /api/instructors` - Get all instructors
- `POST /api/instructors` - Create a new instructor
- `PUT /api/instructors/:id` - Update an instructor
- `DELETE /api/instructors/:id` - Delete an instructor

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create a new class
- `PUT /api/classes/:id` - Update a class
- `DELETE /api/classes/:id` - Delete a class

### Registrations
- `GET /api/registrations` - Get all registrations
- `POST /api/registrations` - Create a new registration
- `PUT /api/registrations/:id` - Update a registration
- `DELETE /api/registrations/:id` - Delete a registration
- `POST /api/registrations/upload` - Upload CSV file

### Reports
- `GET /api/reports` - Get various reports and analytics

### Configuration
- `GET /api/config` - Get system configuration
- `PUT /api/config` - Update system configuration

## Environment Variables

- `PORT` - Server port (default: 5001)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)
- `CLASS_DURATION` - Default class duration in minutes
- `MAX_STUDENT_CLASSES_PER_DAY` - Maximum classes per student per day
- `MAX_INSTRUCTOR_CLASSES_PER_DAY` - Maximum classes per instructor per day
- `MAX_CLASSES_PER_TYPE` - Maximum classes per type

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- CSV parsing with csv-parser
- File upload with multer
- CORS support
- Environment configuration with dotenv