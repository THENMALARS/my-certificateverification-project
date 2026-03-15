# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────┐      │
│  │   Admin    │  │  Student   │  │  Public Users    │      │
│  │  Dashboard │  │  Portal    │  │  (Search Only)   │      │
│  └────────────┘  └────────────┘  └──────────────────┘      │
│         │               │                  │                │
└─────────┼───────────────┼──────────────────┼────────────────┘
          │               │                  │
          └───────────────┴──────────────────┘
                          │
                    [HTTPS/API]
                          │
┌─────────────────────────┴────────────────────────────────────┐
│                    APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Express.js REST API                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐             │   │
│  │  │   Auth   │ │Certificate│ │  User    │             │   │
│  │  │  Routes  │ │  Routes   │ │ Routes   │             │   │
│  │  └──────────┘ └──────────┘ └──────────┘             │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                    │
│  ┌──────────────────────┴──────────────────────────────┐   │
│  │              MIDDLEWARE LAYER                        │   │
│  │  • Authentication (JWT)                              │   │
│  │  • Authorization (Role-based)                        │   │
│  │  • File Upload (Multer)                              │   │
│  │  • Error Handling                                    │   │
│  │  • Rate Limiting                                     │   │
│  │  • Security Headers (Helmet)                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                    │
│  ┌──────────────────────┴──────────────────────────────┐   │
│  │              BUSINESS LOGIC LAYER                    │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐             │   │
│  │  │   Auth   │ │Certificate│ │  User    │             │   │
│  │  │Controller│ │Controller │ │Controller│             │   │
│  │  └──────────┘ └──────────┘ └──────────┘             │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                    │
│  ┌──────────────────────┴──────────────────────────────┐   │
│  │              UTILITY LAYER                           │   │
│  │  • Excel Validator                                   │   │
│  │  • PDF Generator                                     │   │
│  │  • Token Utils                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────────┐
│                    DATA LAYER                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MongoDB Database                         │   │
│  │  ┌──────────┐ ┌──────────┐                           │   │
│  │  │  Users   │ │Certificates                          │   │
│  │  │Collection│ │Collection│                           │   │
│  │  └──────────┘ └──────────┘                           │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Certificate Upload Flow (Admin)

```
Admin → Login
  ↓
Generate JWT Token
  ↓
Upload Excel File
  ↓
Multer Middleware (Validate File Type/Size)
  ↓
Auth Middleware (Verify Token)
  ↓
Authorization Middleware (Check Admin Role)
  ↓
Certificate Controller
  ↓
Excel Validator (Validate Data Structure)
  ↓
Check for Duplicates in DB
  ↓
Insert Certificates to MongoDB
  ↓
Delete Temporary File
  ↓
Return Success Response
```

### 2. Certificate Search Flow (Public)

```
User → Enter Certificate ID
  ↓
Send GET Request
  ↓
Certificate Controller
  ↓
Query MongoDB (Indexed Search)
  ↓
Check Status (Active/Revoked)
  ↓
Return Certificate Data
  ↓
Display Certificate
```

### 3. Certificate Download Flow

```
User → Click Download
  ↓
Send GET Request with Certificate ID
  ↓
Certificate Controller
  ↓
Find Certificate in MongoDB
  ↓
PDF Generator
  ↓
Generate PDF with Certificate Data
  ↓
Increment Download Counter
  ↓
Update Last Downloaded Timestamp
  ↓
Send PDF as Response
  ↓
Browser Downloads File
```

### 4. Authentication Flow

```
User → Enter Credentials
  ↓
Send POST Request to /api/auth/login
  ↓
Auth Controller
  ↓
Find User in Database
  ↓
Compare Password (bcrypt)
  ↓
Generate JWT Token
  ↓
Update Last Login
  ↓
Return Token + User Data
  ↓
Store Token in Client
  ↓
Use Token for Subsequent Requests
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Network Security                              │
│  • HTTPS/SSL                                            │
│  • CORS Configuration                                   │
│  • Rate Limiting (100 req/15min)                        │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 2: Application Security                          │
│  • Helmet.js (Security Headers)                         │
│  • Input Validation                                     │
│  • File Type/Size Validation                            │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Authentication & Authorization                 │
│  • JWT Tokens (7 day expiry)                            │
│  • HTTP-Only Cookies                                    │
│  • Role-Based Access Control                            │
│  • Protected Routes Middleware                          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 4: Data Security                                 │
│  • Password Hashing (bcrypt, 10 rounds)                 │
│  • MongoDB Security                                     │
│  • Input Sanitization                                   │
│  • SQL/NoSQL Injection Prevention                       │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: String (enum: ['admin', 'user']),
  isActive: Boolean,
  createdAt: Date,
  lastLogin: Date
}
```

### Certificates Collection
```javascript
{
  _id: ObjectId,
  certificateId: String (unique, indexed, uppercase),
  studentName: String (text indexed),
  domain: String,
  startDate: String,
  endDate: String,
  issueDate: Date,
  uploadedBy: ObjectId (ref: User),
  status: String (enum: ['active', 'revoked']),
  downloadCount: Number,
  lastDownloaded: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## API Structure

```
/api
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   ├── GET    /me
│   ├── GET    /logout
│   ├── PUT    /updatedetails
│   └── PUT    /updatepassword
│
├── /certificates
│   ├── GET    /search/:certificateId     [PUBLIC]
│   ├── GET    /download/:certificateId   [PUBLIC]
│   ├── POST   /upload                    [ADMIN]
│   ├── GET    /                          [ADMIN]
│   ├── GET    /stats                     [ADMIN]
│   ├── GET    /:id                       [ADMIN]
│   ├── PUT    /:id                       [ADMIN]
│   └── DELETE /:id                       [ADMIN]
│
└── /users                                [ALL ADMIN]
    ├── GET    /
    ├── GET    /:id
    ├── POST   /
    ├── PUT    /:id
    ├── DELETE /:id
    └── PATCH  /:id/toggle-status
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **Excel Processing**: XLSX
- **PDF Generation**: PDFKit
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator

### Frontend (To Be Implemented)
- **Library**: React.js
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: Context API / Redux
- **Notifications**: React Toastify
- **Excel Processing**: XLSX (client-side)

### DevOps
- **Version Control**: Git
- **Package Manager**: npm
- **Environment**: dotenv
- **Development**: nodemon

## Scalability Considerations

### Database
- Indexed fields for fast queries
- Pagination for large datasets
- Connection pooling
- Replica sets for high availability

### Application
- Stateless design (JWT tokens)
- Horizontal scaling ready
- Load balancer compatible
- Microservices ready

### Performance
- Response caching (future)
- CDN for static assets (future)
- Database query optimization
- Compression middleware (future)

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Setup                      │
└─────────────────────────────────────────────────────────┘

Frontend (Vercel/Netlify)
    ↓
Load Balancer
    ↓
Backend API Servers (Heroku/Railway/DigitalOcean)
    ↓
MongoDB Atlas (Cloud Database)
    ↓
Backup Storage
```

## Monitoring & Logging

```
Application Logs
    ↓
Error Tracking Service (Sentry)
    ↓
Performance Monitoring (New Relic)
    ↓
Database Monitoring (MongoDB Atlas Dashboard)
    ↓
Alerts & Notifications
```