# Harum - Knowledge Sharing Platform 

A full-featured social platform designed for creating, sharing, and interacting with rich-text articles, built with a modern React frontend and a Java Spring Boot backend.

---

## ✨ Key Features & Technical Highlights

- **🚀 High-Performance Data Handling:** Leveraged **React Query** to efficiently manage server state, implementing robust caching, automatic data refetching, and optimistic updates to ensure a fast, responsive user experience and minimize API calls.

- **✍️ Modern Block-Style Editor:** Integrated **Editor.js** to provide a clean, powerful rich-text editor, allowing users to craft beautifully formatted articles.

- **👥 Comprehensive Social Interaction:** Engineered a full suite of social features including a user-following system, and multi-level interactions on posts (liking, commenting, saving, and reporting) to foster an engaging community.

- **🔐 Full User Lifecycle:** Developed a complete user authentication flow with JWT, OTP email verification, secure client-side routing, and dynamic user profile pages to showcase user-generated content and social activity.

- **💬 Real-Time Communication:** Built direct messaging and notifications over **WebSocket (STOMP)**, enabling instant user-to-user conversations.

- **🎯 Personalized Recommendations:** Integrated a recommendation service to surface relevant articles based on user behavior and favorite topics.

- **🛡️ Admin Dashboard:** Developed an admin interface for managing users, posts, comments, content reports, and platform analytics.

---

## 💻 Tech Stack

### Frontend (`JAVA-Harum-Frontend/`)
- **Core:** ReactJS, JavaScript (ES6+), Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Data & State:** React Query, Axios
- **Editor:** Editor.js
- **Real-Time:** STOMP, SockJS

### Backend (`harum-be/Harum_Backend/`)
- **Core:** Java 17, Spring Boot 3.3
- **Database:** MongoDB
- **Security:** Spring Security, JWT
- **Media:** Cloudinary
- **Email:** Spring Mail (SMTP)
- **Real-Time:** Spring WebSocket


---

## 📁 Project Structure

```
Harum/
├── JAVA-Harum-Frontend/     # React frontend
│   ├── src/app/pages/       # Home, Topic, Profile, Admin...
│   ├── src/app/components/  # Shared UI components
│   └── src/bkUrl.js         # API & WebSocket URL config
│
└── harum-be/
    └── Harum_Backend/       # Spring Boot backend
        ├── Controllers/     # REST API endpoints
        ├── Services/        # Business logic
        ├── Models/          # MongoDB documents
        └── Security/        # JWT authentication
```

## ⚙️ Setup & Installation

### Prerequisites

- Node.js >= 18
- Java 17
- MongoDB (Atlas or local)
- Cloudinary account (image uploads)
- Gmail account (OTP / email)

### 1. Clone the repository

```sh
git clone <repository-url>
cd Harum
```

### 2. Setup the backend

Create a `.env` file in `harum-be/Harum_Backend/src/main/resources/`:

```env
MONGO_USER=<mongodb-username>
MONGO_PASS=<mongodb-password>
MONGO_DB=<database-name>

JWT_SECRET_KEY=<jwt-secret>

EMAIL_PASSWORD=<gmail-app-password>

CLOUD_NAME=<cloudinary-cloud-name>
API_KEY=<cloudinary-api-key>
API_SECRET=<cloudinary-api-secret>

# Optional — recommendation service
RECOMMENDATION_API_URL=http://127.0.0.1:8000/api
```

Start the backend:

```sh
cd harum-be/Harum_Backend

# Windows
mvnw.cmd spring-boot:run

# macOS / Linux
./mvnw spring-boot:run
```

Backend runs at `http://localhost:8080`.

### 3. Setup the frontend

Update API URLs in `JAVA-Harum-Frontend/src/bkUrl.js` if needed:

```js
export const WEBSOCKET_URL = "ws://localhost:8080/ws";
export const API_URL = "http://localhost:8080/api";
```

Install dependencies and start:

```sh
cd JAVA-Harum-Frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---
