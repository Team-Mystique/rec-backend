# Rise Edu consult WebApp-Backend



This is the official academic project for Rise Edu Consult, developed by Team Mystique as part of the DCIT 208 Software Engineering course at the University of Ghana.

#  Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Hosting**: Render/Fly.io (for backend API)
- **Version Control**: Git + GitHub
- **Project Management**: Trello (Agile/Scrum)
  

## Project | Backend Structure

```


├── backend/               # Node.js + Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── .env.example
│   └── server.js

├── README.md
├── .gitignore
└── LICENSE
```

##  Setup Instructions

### 1. Clone the repository


#### Backend
```bash
git clone https://github.com/Team-Mystique/rec-backend.git
cd rec-backend 
```


### 2. Set up the backend (Node.js + Express)

```bash
cd ../rec-backend
npm install
node server.js or npm run dev
```

Create a `.env` file with the following:

```
# MongoDB Connection (use either MONGODB_URI or MONGO_URI)
MONGODB_URI=your_mongodb_connection_string

# JWT Secret Key (generate a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Server Port (optional, defaults to 5000)
PORT=5000

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://rec-frontend.vercel.app
```

**Note**: You can copy `.env.example` to `.env` and update the values.

## 🔗 Frontend-Backend Connection

This backend is configured for seamless frontend integration with proper CORS, authentication, and error handling.

### Quick Connection Test
```bash
# Test backend connectivity
./test-frontend-connection.sh

# Or check health endpoint
curl http://localhost:5000/health
```

### Key Features for Frontend Integration
- ✅ **CORS Configuration**: Supports multiple frontend origins
- ✅ **Health Check Endpoint**: `GET /health` for connectivity testing
- ✅ **API Documentation**: `GET /api-info` for endpoint information
- ✅ **Request Logging**: Logs all requests for debugging
- ✅ **Error Handling**: Consistent error responses for frontend
- ✅ **JWT Authentication**: Secure token-based authentication

### For Frontend Developers
📖 **Complete integration guide**: See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)

**Quick Start:**
1. Set your frontend API URL: `http://localhost:5000`
2. Use health check: `GET /health`
3. Get API documentation: `GET /api-info`
4. Include `Authorization: Bearer <token>` for protected routes

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "role": "student"  // or "admin"
}
```

#### Login User
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Endpoints (Require Authentication)
Include `Authorization: Bearer <token>` header for all protected routes.

#### Dashboard Routes
- `GET /api/dashboard` - Get user dashboard data
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

#### Admin Routes (Admin Only)
- `GET /api/admin/users` - Get all users (with pagination)
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get admin statistics

### Utility Endpoints
- `GET /health` - Health check for frontend connectivity
- `GET /api-info` - Complete API documentation and CORS information

### Testing with JWT Token
Use the `generate-token.js` script to create test tokens:
```bash
node generate-token.js
```

## Deployment Plan

- **Backend**: Render or Fly.io (free tiers)
- **Database**: MongoDB Atlas (Free Cluster)

##  Team Mystique 

| Name             | Role                    |
| ---------------- | ----------------------- |
| Ebenezer Fuachie | Project Lead(Scrum Master) / Backend Dev  |
| Assah Francis Yeboah       | Frontend Dev/Designer     |
| Farrash Osman       | Frontend Dev/Designer      |
| David Boafo Adjei      | Frontend Dev/QA & Testing Lead/Designer       |
| Roselyn Francis       | Database Admin/Backend Dev      |
| Kingslla Gyan        | Backend Developer      |
| Prince Kwaku Enam Ametefe       | Backend Developer |

---

© 2025 Team Mystique — UG Legon

<div align="center">
  <img src="Team Logo.png" alt="Team Logo" width="250"/>
</div>


