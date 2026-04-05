# Neurox Backend - Spring Boot

Complete backend for Neurox hackathon project.

## Tech Stack
- Spring Boot 3.2.4
- Spring Data JPA
- H2 Database (in-memory)
- Lombok
- Java 17

## Run Instructions

```bash
# Build and run
mvn clean install
mvn spring-boot:run
```

Server runs on: `http://localhost:8080`

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Questions
- `GET /api/questions` - Get all MCQs

### Responses
- `POST /api/responses` - Submit answer

### Evaluation
- `POST /api/evaluation/{userId}` - Get concept-wise scores

### Roadmap
- `GET /api/roadmap/{userId}` - Get learning modules for weak concepts

### Modules
- `GET /api/modules/{moduleId}` - Get module details

### Progress
- `POST /api/progress` - Mark module as completed

### Dashboard
- `GET /api/dashboard/{userId}` - Get user dashboard

## H2 Console
Access at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:neuroxdb`
- Username: `sa`
- Password: (leave empty)

## Sample Data
10 questions loaded on startup (Java, OOP, DataStructures)
9 learning modules loaded on startup
