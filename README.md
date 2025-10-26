# Class Scheduling Service Setup Guide

This guide will help you set up, configure, and seed your local development environment for the Class Scheduling Service.

## Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (local or cloud instance)

## 1. Clone the Repository

```bash
git clone https://github.com/Jumanaiqbal/class-scheduling-service.git
cd class-scheduling-service
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```
MONGODB_URI=mongodb://localhost:27017/class-scheduling
```

- Replace the URI with your MongoDB connection string if using a cloud instance.

## 4. Seed the Database

The seed script will:

- Clear existing data from Students, Instructors, Class Types, Registrations, and Configs
- Insert sample students, instructors, class types, and config settings
- Add test registrations for today, tomorrow, and past dates
- Add large, randomized registration data for analytics (25 for last 7 days, 150 for past 30 days, 300 for past 90 days)

To run the seed script:

```bash
node src/scripts/seedData.js
```

- You should see logs confirming successful seeding.
- If you see duplicate index warnings, these do not affect data creation but can be cleaned up in model files.

## 5. Start the Development Server

```bash
npm start
```

- The API will be available at `http://localhost:5001` (or your configured port).

## 6. API Endpoints

- **Dashboard Summary:** `/api/dashboard/summary`
- **Dashboard Stats:** `/api/dashboard/stats?days=7`
- Other endpoints are available for students, instructors, registrations, and reports.

## 7. Troubleshooting

- **MongoDB Connection Error:** Ensure MongoDB is running and your URI is correct in `.env`.
- **Duplicate Index Warnings:** Clean up duplicate index definitions in your Mongoose model files if needed.
- **Seeding Errors:** Check for unique constraints on registrationId and ensure the seed script is up to date.

## 8. Customizing Seed Data

- Edit `src/scripts/seedData.js` to adjust the number, distribution, or details of seeded records.
- Rerun the seed script after making changes.

## 9. Useful Commands

- Install new dependencies: `npm install <package>`
- Run tests (if available): `npm test`
- Lint code: `npm run lint`

---

For further help, open an issue or contact the repository owner.

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
