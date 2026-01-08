# JobTracker
A full-stack job application tracking app that allows users to manage and track their job applications across different statuses.

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

### Planned/Future
* Render deployment

## Project Structure
```
jobtracker/
├── frontend/
│   ├── src/
│   │   ├── components
│   │   │   └── Header.jsx
│   │   ├── pages
│   │   │   ├── Jobs.js
│   │   │   ├── Login.js
│   │   │   └── Register.jsx
│   │   ├── api.js
│   │   ├── App.css
│   │   ├── App.js
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
- GET /applications
- POST /applications
- PUT /applications/:id
- DELETE /applications/:id
- POST /login
- POST /register

## Getting Started (Local Setup)
### Prerequisites
* Node.js installed
### Steps
* Clone Repository
* Install dependencies
* Run backend
    ```
    cd JobTracker/backend
    npm start
    ```
* Run frontend
    ```
    cd JobTracker/frontend
    npm run dev
    ```

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
    Dockerization is planned to ensure consisten environment across development and deployment. It simplifies onboarding, reduces "it works on my machine" issues, and prepares the application for future production-grade deployment.
## Known Limitations
* SQLite not ideal for high concurrency
* No cloud presistence on free hosting tiers

## Roadmap/Future Improvements
* User authentication with JWT (completed)
* Per-user job isolation (completed)
* Dockerized deployment
* PostgresSQL migration
* Filtering and sorting



