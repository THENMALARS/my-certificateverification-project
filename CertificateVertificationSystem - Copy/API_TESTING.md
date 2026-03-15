# API Testing Guide

## Using cURL Commands

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register User (Admin Only in Production)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123",
    "role": "user"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@certverify.com",
    "password": "Admin@123"
  }'
```

**Save the token from the response!**

### 4. Get Current User (Protected)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Upload Certificates (Admin Only)
```bash
curl -X POST http://localhost:5000/api/certificates/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@sample-certificates.xlsx"
```

### 6. Get All Certificates (Admin Only)
```bash
curl http://localhost:5000/api/certificates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Search Certificate (Public)
```bash
curl http://localhost:5000/api/certificates/search/CERT2024001
```

### 8. Download Certificate PDF (Public)
```bash
curl http://localhost:5000/api/certificates/download/CERT2024001 \
  --output certificate.pdf
```

### 9. Get Statistics (Admin Only)
```bash
curl http://localhost:5000/api/certificates/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 10. Get All Users (Admin Only)
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Using Postman

### Setup
1. Download Postman from https://www.postman.com/downloads/
2. Create a new collection: "Certificate Verification API"
3. Add environment variable: `baseURL` = `http://localhost:5000`
4. Add environment variable: `token` = (will be set after login)

### Collection Structure

**1. Authentication**
- POST {{baseURL}}/api/auth/register
- POST {{baseURL}}/api/auth/login
- GET {{baseURL}}/api/auth/me
- GET {{baseURL}}/api/auth/logout

**2. Certificates (Public)**
- GET {{baseURL}}/api/certificates/search/:certificateId
- GET {{baseURL}}/api/certificates/download/:certificateId

**3. Certificates (Admin)**
- POST {{baseURL}}/api/certificates/upload (Form Data: file)
- GET {{baseURL}}/api/certificates
- GET {{baseURL}}/api/certificates/stats
- GET {{baseURL}}/api/certificates/:id
- PUT {{baseURL}}/api/certificates/:id
- DELETE {{baseURL}}/api/certificates/:id

**4. Users (Admin)**
- GET {{baseURL}}/api/users
- POST {{baseURL}}/api/users
- GET {{baseURL}}/api/users/:id
- PUT {{baseURL}}/api/users/:id
- DELETE {{baseURL}}/api/users/:id

### Authorization
For protected routes, add header:
```
Authorization: Bearer {{token}}
```

## Testing Flow

### Step 1: Login
```
POST /api/auth/login
{
  "email": "admin@certverify.com",
  "password": "Admin@123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Admin",
    "email": "admin@certverify.com",
    "role": "admin"
  }
}
```

Copy the token!

### Step 2: Upload Certificates
```
POST /api/certificates/upload
Headers: Authorization: Bearer YOUR_TOKEN
Body: Form Data
  file: [Select sample-certificates.xlsx]
```

Response:
```json
{
  "success": true,
  "message": "Successfully uploaded 8 certificates",
  "data": {
    "totalUploaded": 8,
    "certificates": [...]
  }
}
```

### Step 3: Search Certificate
```
GET /api/certificates/search/CERT2024001
```

Response:
```json
{
  "success": true,
  "data": {
    "certificateId": "CERT2024001",
    "studentName": "John Doe",
    "domain": "Web Development",
    "startDate": "01/01/2024",
    "endDate": "31/03/2024",
    ...
  }
}
```

### Step 4: Get Statistics
```
GET /api/certificates/stats
Headers: Authorization: Bearer YOUR_TOKEN
```

Response:
```json
{
  "success": true,
  "data": {
    "totalCertificates": 8,
    "activeCertificates": 8,
    "revokedCertificates": 0,
    "domainStats": [...],
    "totalDownloads": 0
  }
}
```

## Expected Responses

### Success Response
```json
{
  "success": true,
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Field 1 is required", "Field 2 is invalid"]
}
```

## Rate Limiting
- 100 requests per 15 minutes per IP
- Returns 429 Too Many Requests if exceeded

## Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request / Validation Error
- 401: Unauthorized (Missing/Invalid token)
- 403: Forbidden (Insufficient permissions)
- 404: Not Found
- 429: Too Many Requests
- 500: Server Error