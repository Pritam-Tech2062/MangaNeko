# MangaNeko 📚

**MangaNeko** is a full-stack manga reading platform built with **Java Spring Boot** and **React**. The application integrates the **MangaDex API** to provide manga, chapter, and cover information through a custom Spring Boot REST API, while PostgreSQL is used for application-specific data such as user favorites.

## 🚀 Features

- 🔍 Search manga by title
- 📖 Browse manga and chapter information
- 📚 Retrieve manga details and chapters
- 🖼️ Display manga covers
- ❤️ Add and remove manga from favorites
- 👤 User authentication and user-specific data
- 🌐 MangaDex API integration through Spring Boot
- 🗄️ PostgreSQL database integration
- 🔗 RESTful API architecture
- 🧪 API testing with Postman
- ☁️ Backend deployment with Render

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring MVC
- Spring Data JPA
- Hibernate
- REST APIs
- Maven

### Database
- PostgreSQL

### Frontend
- React
- JavaScript
- Vite
- Axios
- HTML/CSS

### External API
- MangaDex API

### Tools & Deployment
- Git
- GitHub
- Postman
- IntelliJ IDEA
- Render

## 🏗️ Architecture

MangaNeko follows a layered backend architecture:

```text
React Frontend
      │
      │ Axios / HTTP
      ▼
Spring Boot REST API
      │
      ├── Controller
      │
      ├── Service
      │
      ├── Repository ───────► PostgreSQL
      │
      └── MangaDex Client ──► MangaDex API
```

The Spring Boot backend acts as an API layer between the frontend and MangaDex. This keeps external API communication inside the backend and allows application-specific functionality such as favorites and user data to be managed through PostgreSQL.

## 📂 Backend Structure

```text
src/main/java/com/dracotech/mangalab/
│
├── Controller/
│   ├── MangaController
│   └── FavouriteController
│
├── Service/
│   └── MangaService
│
├── Client/
│   └── MangaDexClient
│
├── Repository/
│   └── FavouriteRepo
│
└── Entity/
    └── Favourite
```

## 🔌 API Endpoints

### Manga

```http
GET /api/manga/search?title={title}
GET /api/manga/{id}
GET /api/manga/trending
```

### Favorites

```http
GET /api/users/{userId}/favorites
POST /api/favorites
DELETE /api/favorites/{mangaId}?userId={userId}
```

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

> Endpoint names may vary depending on the current implementation of the project.

## 🗄️ Database

PostgreSQL is used to store application-specific information.

Example `user_favourites` structure:

```text
user_favourites
├── id
├── user_id
├── manga_id
├── manga_title
└── manga_cover
```

Manga information that comes directly from MangaDex is fetched through the backend API rather than being unnecessarily duplicated in the local database.

## 🔄 API Flow

A typical manga search request follows this flow:

```text
User searches for manga
        ↓
React / Axios
        ↓
Spring Boot Controller
        ↓
MangaService
        ↓
MangaDexClient
        ↓
MangaDex API
        ↓
Spring Boot
        ↓
JSON Response
        ↓
React Frontend
```

For favorites:

```text
React
  ↓
POST /api/favorites
  ↓
FavouriteController
  ↓
FavouriteService
  ↓
FavouriteRepo
  ↓
PostgreSQL
```

## ▶️ Running Locally

### Prerequisites

Make sure you have installed:

- Java 21
- Maven
- PostgreSQL
- Node.js
- Git

### Backend

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/MangaNeko.git
cd MangaNeko
```

Configure your PostgreSQL database and update the Spring Boot configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/YOUR_DATABASE
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

Run the backend:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## 🧪 Testing the API

The backend REST APIs can be tested using **Postman**.

Example:

```http
GET http://localhost:8080/api/manga/search?title=naruto
```

You can also test favorites and authentication endpoints directly through Postman.

## 🌐 Deployment

The Spring Boot backend has been deployed using **Render**.

Production backend:

```text
https://manganeko-2.onrender.com
```

The React frontend communicates with the deployed Spring Boot REST API.

## 🔐 Security & Configuration

Sensitive configuration such as:

- Database credentials
- API keys
- Environment-specific settings

should not be committed to GitHub.

Use environment variables or local configuration files for sensitive information.

## 📸 Screenshots

Add screenshots of the application here:

```text
screenshots/
├── home.png
├── search.png
├── manga-details.png
├── chapters.png
└── favorites.png
```

## 📌 Future Improvements

- [ ] JWT-based authentication
- [ ] Advanced manga filtering by genre
- [ ] Pagination and improved API performance
- [ ] Reading history
- [ ] User profiles
- [ ] Dockerize the Spring Boot application
- [ ] Add automated tests
- [ ] Improve API documentation with Swagger/OpenAPI
- [ ] Add caching for frequently requested MangaDex data

## 👨‍💻 Developer

**Pritam Dombare**

Computer Engineering Student  
Focused on **Java Backend Development, Spring Boot, REST APIs, and PostgreSQL**.

---

⭐ If you found MangaNeko useful, consider giving the repository a star!
