 Complete Setup Guide - Certificate Verification System

 🎯 Overview

This guide will help you set up and run the complete MERN stack application.

---

 📋 Prerequisites

Before starting, make sure you have:

- ✅ Node.js (v14 or higher) - [Download](https://nodejs.org/)
- ✅ MongoDB (local or MongoDB Atlas) - [Download](https://www.mongodb.com/try/download/community)
- ✅ Git (optional) - [Download](https://git-scm.com/)
- ✅ Code Editor*(VS Code recommended) - [Download](https://code.visualstudio.com/)

---

🚀 Step-by-Step Setup

 Step 1: Setup MongoDB

 Option A: MongoDB Atlas (Cloud - Recommended for Beginners)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. It looks like: `mongodb+srv://username:password@cluster.mongodb.net/certverify`

Option B: Local MongoDB

```bash
# macOS (using Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Download installer from mongodb.com and install
# MongoDB will start automatically
```

---

 Step 2: Setup Backend

```bash
# 1. Navigate to backend folder
cd cert-verification-mern/backend

# 2. Install dependencies (this will take a few minutes)
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env file
# Open .env in your text editor and update:
```

**Edit `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/certificate-verification
# OR if using MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/certverify

JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@certverify.com
ADMIN_PASSWORD=Admin@123
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

```bash
# 5. Create admin user
node seeder.js

# You should see:
# ✅ Admin user created successfully
# 📧 Email: admin@certverify.com
# 🔑 Password: Admin@123

# 6. Start backend server
npm run dev

# You should see:
# ✅ MongoDB Connected
# 🚀 Server running on port 5000
```

Keep this terminal open!

---

 Step 3: Setup Frontend

```bash
# 1. Open a NEW terminal window
# 2. Navigate to frontend folder
cd cert-verification-mern/frontend

# 3. Install dependencies (this will take a few minutes)
npm install

# 4. Start frontend server
npm start

# Browser will automatically open at http://localhost:3000
```

---

✅ Verify Everything is Working

 1. Check Backend
Open http://localhost:5000 in your browser

You should see:
```json
{
  "message": "Welcome to Certificate Verification System API",
  "version": "1.0.0"
}
```

2. Check Frontend
Your browser should automatically open http://localhost:3000

You should see the Certificate Search page.

---

🎮 Test the Application

 1. Login as Admin

1. Click **"Login"** button in navbar
2. Enter credentials:
   - Email: `admin@certverify.com`
   - Password: `Admin@123`
3. Click **"Login"**
4. You'll be redirected to the Dashboard

 2. Upload Certificates

1. Click **"Upload Certificates"** in navbar
2. Click **"Select File"**
3. Choose `sample-certificates.xlsx` (in project root)
4. Click **"Upload Certificates"**
5. You should see success message

3. View Dashboard

1. Click **"Dashboard"** in navbar
2. You should see:
   - Total Certificates: 8
   - Active Certificates: 8
   - Domain distribution table

 4. Search Certificate (Public)

1. Click **"Logout"**
2. Click **"Search Certificate"** or go to home page
3. Enter: `CERT2024001`
4. Click **"Search"**
5. Certificate should appear!
6. Click **"Download PDF"** to download

---

🖥️ Running Both Servers

You need **TWO terminal windows open**:

**Terminal 1 - Backend:**
```bash
cd cert-verification-mern/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd cert-verification-mern/frontend
npm start
```

---

 📁 Project Structure

```
cert-verification-mern/
│
├── backend/                    ← Backend (Node.js/Express)
│   ├── models/                 ← Database schemas
│   ├── controllers/            ← Business logic
│   ├── routes/                 ← API endpoints
│   ├── middleware/             ← Auth, upload, errors
│   ├── utils/                  ← Helper functions
│   ├── uploads/                ← Temporary files
│   ├── .env                    ← Configuration (create this)
│   ├── package.json            ← Dependencies
│   ├── seeder.js               ← Create admin user
│   └── server.js               ← Main server file
│
├── frontend/                   ← Frontend (React)
│   ├── public/                 ← Static files
│   ├── src/
│   │   ├── components/         ← Reusable components
│   │   ├── pages/              ← Page components
│   │   ├── context/            ← State management
│   │   ├── utils/              ← Helper functions
│   │   ├── styles/             ← CSS files
│   │   ├── App.js              ← Main app
│   │   └── index.js            ← Entry point
│   └── package.json            ← Dependencies
│
├── sample-certificates.xlsx    ← Test data
├── README.md                   ← Project documentation
├── SETUP_GUIDE.md             ← This file
└── PROJECT_CHECKLIST.md       ← Feature checklist
```

---

 🐛 Common Issues & Solutions

 Issue 1: Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

 Issue 2: Cannot Connect to MongoDB

**Error:** `Error: connect ECONNREFUSED`

**Solution:**
- **Local MongoDB:** Make sure MongoDB is running (`mongod`)
- **MongoDB Atlas:** Check connection string in `.env`
- **Firewall:** Add your IP to Atlas whitelist (0.0.0.0/0 for development)

 Issue 3: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

 Issue 4: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Make sure backend is running
- Check backend CORS configuration includes `http://localhost:3000`
- Restart both servers

 Issue 5: Login Not Working

**Error:** `Invalid credentials`

**Solution:**
```bash
# Recreate admin user
cd backend
node seeder.js

# Use exact credentials:
# Email: admin@certverify.com
# Password: Admin@123
```

 Issue 6: File Upload Fails

**Error:** `File upload error`

**Solution:**
- Check file format (.xlsx, .xls, or .csv)
- File size must be under 5MB
- Ensure `backend/uploads/` folder exists
- Check Excel has correct columns

---

 📊 Test Data

The `sample-certificates.xlsx` file contains 8 test certificates:

| Certificate ID | Student Name | Domain |
|---------------|--------------|---------|
| CERT2024001 | John Doe | Web Development |
| CERT2024002 | Jane Smith | Data Science |
| CERT2024003 | Mike Johnson | Mobile App Development |
| CERT2024004 | Sarah Williams | UI/UX Design |
| CERT2024005 | David Brown | Machine Learning |
| CERT2024006 | Emily Davis | Cloud Computing |
| CERT2024007 | James Wilson | Cybersecurity |
| CERT2024008 | Lisa Anderson | Artificial Intelligence |

Try searching for any of these IDs!

---

 🔐 Security Notes

Important for Production:

1. Change default password immediately after first login
2. Use strong JWT_SECRET in production
3. Enable HTTPS for production deployment
4. Set NODE_ENV=production in production
5. Use MongoDB Atlas with proper authentication
6. Enable rate limiting (already configured)
7. Regular backups of database

---

 🎯 What's Next?

Once everything is running:

1. ✅ Login as admin
2. ✅ Upload sample certificate data
3. ✅ Explore the dashboard
4. ✅ Test certificate search
5. ✅ Download certificates as PDF
6. ✅ Customize the certificate design
7. ✅ Deploy to production (see deployment guide)

---

 📚 Additional Resources

- Full Documentation: See `README.md`
- API Testing: See `API_TESTING.md`
- Project Features: See `PROJECT_CHECKLIST.md`
- System Architecture: See `ARCHITECTURE.md`

---

🆘 Need Help?

If you encounter any issues:

1. Check this troubleshooting section
2. Review the error messages carefully
3. Check both terminal outputs (backend & frontend)
4. Ensure all prerequisites are installed
5. Try restarting both servers

---

🎉 Success Checklist

- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can login with admin credentials
- [ ] Can upload certificates
- [ ] Can search certificates
- [ ] Can download certificates

If all checked ✅ - Congratulations! You're all set! 🚀

---

*