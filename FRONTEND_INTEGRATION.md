# Frontend-Backend Integration Guide

This guide provides all the necessary information for connecting your frontend application to the Rise Edu Consult backend.

## 🚀 Quick Start

1. **Backend URL**: `http://localhost:5000` (development)
2. **Health Check**: `GET /health` - Verify backend connectivity
3. **API Documentation**: `GET /api-info` - Get complete endpoint information

## 🔧 Configuration

### Environment Variables
Add these to your frontend `.env` file:
```bash
REACT_APP_API_URL=http://localhost:5000
# or for other frameworks:
VITE_API_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### CORS Configuration
The backend accepts requests from:
- `http://localhost:3000` (React default)
- `http://localhost:3001` (alternate port)
- `https://rec-frontend.vercel.app` (production)

To add more origins, update the `ALLOWED_ORIGINS` in the backend `.env` file.

## 📡 API Endpoints

### Authentication
```javascript
// Register new user
POST /register
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // or "admin"
}

// Login user
POST /login
Content-Type: application/json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Routes (Require JWT Token)
```javascript
// Get dashboard data
GET /api/dashboard
Authorization: Bearer <jwt_token>

// Get user profile
GET /api/profile
Authorization: Bearer <jwt_token>

// Update user profile
PUT /api/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json
{
  "name": "Updated Name"
}
```

### Admin Routes (Require Admin Role)
```javascript
// Get all users
GET /api/admin/users?page=1&limit=10
Authorization: Bearer <admin_jwt_token>

// Get user by ID
GET /api/admin/users/:id
Authorization: Bearer <admin_jwt_token>

// Update user
PUT /api/admin/users/:id
Authorization: Bearer <admin_jwt_token>

// Delete user
DELETE /api/admin/users/:id
Authorization: Bearer <admin_jwt_token>

// Get admin statistics
GET /api/admin/stats
Authorization: Bearer <admin_jwt_token>
```

## 🔐 Authentication Flow

### 1. Frontend Login Example (React)
```javascript
const login = async (email, password) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for CORS
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.status === 'success') {
      // Store token in localStorage or secure storage
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

### 2. Making Authenticated Requests
```javascript
const makeAuthenticatedRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  };

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}${endpoint}`, 
    { ...defaultOptions, ...options }
  );

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  return response.json();
};
```

### 3. Protected Route Component
```javascript
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await makeAuthenticatedRequest('/api/profile');
        if (response.status === 'success') {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
};
```

## 🛠️ Error Handling

### Common Error Responses
```javascript
// 400 - Bad Request
{
  "status": "error",
  "message": "All fields (name, email, password, role) are required"
}

// 401 - Unauthorized
{
  "status": "error", 
  "message": "Access denied. No token provided."
}

// 403 - Forbidden
{
  "status": "error",
  "message": "Access denied. Admin privileges required."
}

// 404 - Not Found
{
  "status": "error",
  "message": "Route not found",
  "path": "/invalid-endpoint"
}

// 500 - Server Error
{
  "status": "error",
  "message": "Internal server error"
}
```

### Frontend Error Handler
```javascript
const handleApiError = (error, response) => {
  switch (response?.status) {
    case 400:
      // Validation errors
      toast.error(error.message || 'Invalid input data');
      break;
    case 401:
      // Authentication required
      localStorage.removeItem('token');
      navigate('/login');
      toast.error('Please login to continue');
      break;
    case 403:
      // Insufficient permissions
      toast.error('You do not have permission for this action');
      break;
    case 404:
      // Not found
      toast.error('Resource not found');
      break;
    case 500:
      // Server error
      toast.error('Server error. Please try again later.');
      break;
    default:
      toast.error('An unexpected error occurred');
  }
};
```

## 🧪 Testing Connection

Use the provided test script to verify connectivity:
```bash
./test-frontend-connection.sh
```

Or manually test endpoints:
```bash
# Health check
curl http://localhost:5000/health

# API info
curl http://localhost:5000/api-info

# Test CORS
curl -H "Origin: http://localhost:3000" http://localhost:5000/
```

## 🌐 Production Deployment

### Backend Environment Variables
```bash
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_production_secret
FRONTEND_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

### Frontend Environment Variables
```bash
REACT_APP_API_URL=https://your-backend-api.com
```

## 📝 Notes

1. **CORS**: The backend is configured to accept requests from common development ports and can be extended for production domains.

2. **Authentication**: JWT tokens expire in 24 hours. Implement token refresh logic in production.

3. **Error Handling**: All API responses follow a consistent format with `status` and `message` fields.

4. **Rate Limiting**: Consider implementing rate limiting in production for API endpoints.

5. **HTTPS**: Always use HTTPS in production for secure token transmission.

## 🆘 Troubleshooting

### CORS Issues
- Ensure your frontend URL is in the `ALLOWED_ORIGINS` environment variable
- Check browser console for CORS errors
- Verify `credentials: 'include'` is set in fetch requests

### Authentication Issues
- Check token format: `Bearer <token>`
- Verify token is not expired
- Ensure JWT_SECRET matches between environments

### Connection Issues
- Test health endpoint: `GET /health`
- Check backend server logs
- Verify environment variables are loaded correctly