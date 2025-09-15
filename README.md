# SkillSphere - Learning Management System

A comprehensive Learning Management System built with the **MERN Stack** demonstrating enterprise-level web application development skills, modern React patterns, and scalable backend architecture.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-61DAFB?style=flat-square&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

## 🚀 Technical Highlights

**Full-Stack Architecture:**
- **Backend**: Node.js + Express.js REST API with JWT authentication
- **Frontend**: React 18 + Vite with modern hooks and Context API
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Vercel (Full-Stack deployment configuration)

**Advanced Features:**
- Role-based authentication (Students & Instructors)
- File upload with Cloudinary integration
- Payment processing with PayPal SDK
- Real-time progress tracking
- Responsive UI with Tailwind CSS + Radix UI components

## 🛠️ Technology Stack

### Backend
```javascript
"dependencies": {
  "express": "^4.21.0",           // RESTful API framework
  "mongoose": "^8.6.3",           // MongoDB object modeling
  "jsonwebtoken": "^9.0.2",       // JWT authentication
  "bcryptjs": "^2.4.3",          // Password hashing
  "cloudinary": "^2.5.0",        // Media management
  "paypal-rest-sdk": "^1.8.1",   // Payment integration
  "multer": "^1.4.5-lts.1",      // File upload handling
  "cors": "^2.8.5"               // Cross-origin resource sharing
}
```

### Frontend
```javascript
"dependencies": {
  "react": "^18.3.1",                     // Modern React with hooks
  "react-router-dom": "^6.26.2",         // Client-side routing
  "axios": "^1.7.7",                     // HTTP client
  "framer-motion": "^11.7.0",            // Animations
  "react-player": "^2.16.0",             // Video player component
  "@radix-ui/react-*": "*",              // Accessible UI components
  "tailwindcss": "^3.4.12",              // Utility-first CSS
  "lucide-react": "^0.441.0"             // Modern icons
}
```

## 🔧 Architecture & Design Patterns

### Backend Architecture
- **MVC Pattern**: Organized controllers, models, and routes
- **Middleware**: Custom authentication middleware with JWT
- **Error Handling**: Global error handling middleware
- **File Upload**: Multer + Cloudinary integration
- **Database**: MongoDB with structured schemas and relationships

### Frontend Architecture
- **Component-Based**: Modular, reusable React components
- **State Management**: Context API for global state
- **Routing**: Protected routes with role-based access
- **UI Library**: Custom component system with Radix UI
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 📊 Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Student/Instructor)
- Protected routes and middleware
- Secure password hashing with bcrypt

### 👨‍🏫 Instructor Dashboard
- Course creation and management
- Video/media upload with Cloudinary
- Student enrollment tracking
- Revenue analytics

### 👨‍🎓 Student Experience
- Course browsing with advanced filtering
- Video streaming with progress tracking
- PayPal payment integration
- Certificate generation
- Progress reset functionality

### 💳 Payment Processing
- PayPal SDK integration
- Order creation and capture
- Transaction history
- Secure payment flow

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- PayPal Developer account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/adityapandey78/SkillShpere-LMS.git
cd SkillShpere-LMS
```

2. **Backend Setup**
```bash
cd server
npm install
# Configure your environment variables in .env file
npm run dev
```

3. **Frontend Setup**
```bash
cd client
npm install
npm run dev
```

### Environment Variables
```env
# Server (.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Client (.env)
VITE_API_URL=http://localhost:5000
```

## 📡 API Documentation

### Authentication Endpoints
```
POST   /auth/register          # User registration
POST   /auth/login             # User login
GET    /auth/check-auth        # Verify JWT token
```

### Course Management (Instructor)
```
POST   /instructor/course/add                    # Create course
GET    /instructor/course/get                    # Get instructor courses
GET    /instructor/course/get/details/:id        # Get course details
PUT    /instructor/course/update/:id             # Update course
```

### Media Management
```
POST   /media/upload           # Upload single file
POST   /media/bulk-upload      # Bulk file upload
DELETE /media/delete/:id       # Delete file
```

### Student Operations
```
GET    /student/course/get                               # Browse courses
GET    /student/course/get/details/:id                   # Course details
POST   /student/order/create                             # Create order
POST   /student/order/capture                            # Process payment
GET    /student/courses-bought/get/:studentId            # Enrolled courses
GET    /student/course-progress/get/:userId/:courseId    # Get progress
POST   /student/course-progress/mark-lecture-viewed      # Mark complete
POST   /student/course-progress/reset-progress           # Reset progress
```

## 🌐 Deployment

### Full-Stack Vercel Deployment
- Configured `vercel.json` for both frontend and backend
- Environment variable management
- Automatic deployments from Git
- Optimized build configuration for production

## 💻 Database Schema

### User Model
```javascript
{
  userName: String,
  userEmail: String,
  password: String,      // Hashed with bcrypt
  role: String          // "user" or "instructor"
}
```

### Course Model
```javascript
{
  instructorId: String,
  instructorName: String,
  title: String,
  category: String,
  level: String,
  primaryLanguage: String,
  description: String,
  pricing: Number,
  curriculum: [LectureSchema],
  students: [StudentSchema],
  isPublised: Boolean
}
```

## 🔍 Code Quality & Best Practices

- **ES6+ Features**: Arrow functions, destructuring, async/await
- **Component Composition**: Reusable UI components with proper prop handling
- **Error Boundaries**: Graceful error handling and user feedback
- **Performance Optimization**: Code splitting and lazy loading
- **Security**: Input validation, JWT implementation, CORS configuration
- **Responsive Design**: Mobile-first responsive layouts
- **TypeScript Ready**: Structured for easy TypeScript migration

## 🎯 Key Technical Achievements

### Backend Development
- RESTful API design with proper HTTP status codes
- JWT authentication with middleware protection
- File upload handling with Multer and Cloudinary
- Payment processing with PayPal SDK
- MongoDB integration with Mongoose ODM
- Error handling and validation

### Frontend Development
- Modern React 18 with functional components and hooks
- Context API for global state management
- Protected routing with role-based access
- Responsive design with Tailwind CSS
- Custom UI component library with Radix UI
- Video player integration with progress tracking

### DevOps & Deployment
- Full-stack Vercel deployment configuration
- Environment variable management
- Production-ready build optimization
- CORS configuration for cross-origin requests

---

**This project demonstrates proficiency in:**
- Full-Stack JavaScript development
- Modern React development patterns
- RESTful API design and implementation
- Database design and optimization
- Third-party service integration
- Authentication and authorization
- Payment processing
- Cloud deployment and DevOps
