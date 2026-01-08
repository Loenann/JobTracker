# JobTracker
A full-stack job application tracking app that allows users to manage and track their job applications across different statuses.

JobTracker URL: https://jobtracker-zckw.onrender.com

## Features
* Create, view, update, and delete job applications
* Track application status (Applied, Interview, Offer, Rejected)
* Color-coded status indicators
* RESTful API backend
* User Authentication and per-user data isolation
* Dockerized deployment

## Tech Stack
### Frontend
* React (Vite)
* Axios
* CSS

### Backend
* Node.js
* Express
* SQLite (better-sqlite3)
* JWT authentication

### DevOps/Deployment
* Docker
* Docker Compose
* Render (cloud deployment)

## Project Structure
```
jobtracker/
├── frontend/
│   ├── src/
│   │   ├── components
│   │   │   └── Header.jsx
│   │   ├── pages
│   │   │   ├── Jobs.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── api.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   └── vite.config.js 
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   └── db.js
│   ├── data/
│   │    └── jobtracker.db
│   ├── Dockerfile
├── docker-compose.yaml
└── README.md
```

## API Overview
- ```GET /applications``` : Feth user's job applications
- ```POST /applications``` : Create a new job application
- ```PUT /applications/:id``` : Update an existing application
- ```DELETE /applications/:id``` : Delete an application
- ```POST /login``` : Register a new user
- ```POST /register``` : Authenticate user and return JWT

## Getting Started (Local Setup)
### Prerequisites
* Node.js (v18+ recommended)
* npm
### Steps
* Clone Repository
* Install dependencies
* Run backend
    ```
    cd JobTracker/backend
    npm install
    npm start
    ```
* Run frontend
    ```
    cd JobTracker/frontend
    npm install
    npm run dev
    ```
* Access frontend from http://localhost:5173
* Access backend from http://localhost:3001

## Getting Started (Local Setup with Docker)
### Prerequisites
* Docker
* Docker Compose
### Steps
1. Clone the repository
```
git clone git@github.com:Loenann/JobTracker.git
cd jobtracker
```
2. Build and start the application
```
docker compose up --build
```
3. Access the application
* Frontend: http://localhost:5173
* Backend: http://localhost:3001

## Design Decisions
### Why SQLite?
    SQLite was chosen for its simplicity and ease of setup, making it ideal for a minimum viable product (MVP). It requires no separate database server and works well for local development and small-scale usage. For future scalability and multi-user support, the database can be migrated to PostgreSQL.

### Why REST?
    A REST architecture was chosen because it provides a clear and predictable structure for client-server communication. REST keeps the frontend and backend loosely coupled. It also makes the API easier to test, extend, and potentially integrate with other clients in the future.

### Why REACT?
    React enables component-based UI development and effecient state management for dynamic user interactions. Vite was selected for its fast development server and minimal configuration, allowing quicker iteration during development.

### Why Render?
    Render was selected as a deployment target due to its simplicity and low barrier to entry. It supports full-stack applications with minimal configuration, making it suitable for small projects, demos, and portofolio applications.

### Why Dockerize?
    Docker ensure consistent environment across development and deployment. It simplifies setup, reduces configuration issues, and prepares the project for future scalability.

## Known Limitations
* SQLite not ideal for high concurrency
* No cloud presistence on free hosting tiers
* No role-based access control (single user role)

## Roadmap/Future Improvements
* UI enhancements and improved form validation
* Filtering and sorting job applications
* Page for large datasets
* Migration to Postgres
* Refresh token support for authentication
* Improved error handling and user feedback



