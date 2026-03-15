 Quick Setup Guide

 Step-by-Step Installation

1. Install MongoDB
**Option A: Local MongoDB**
```bash
# macOS
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Windows
Download from: https://www.mongodb.com/try/download/community
```

**Option B: MongoDB Atlas (Cloud - Recommended for beginners)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Use in .env file

 2. Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your settings
# If using MongoDB Atlas, update MONGODB_URI
# Example: mongodb+srv://username:password@cluster.mongodb.net/certverify

# Create admin user
node seeder.js

# Start server
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
✅ Admin user created successfully
```

3. Setup Frontend

```bash
# Open new terminal
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

Browser will open at http://localhost:3000

 4. Login and Test

Admin Login:
- Email: admin@certverify.com
- Password: Admin@123

Test Certificate Upload:
1. Use the sample Excel file included
2. Go to Admin Panel → Upload Certificates
3. Select the sample-certificates.xlsx
4. Click Upload

Test Certificate Search:
1. Logout
2. Go to Search page
3. Enter: CERT2024001
4. View and download certificate

 Common Issues

Issue: "Cannot connect to MongoDB"
Solution:
- Make sure MongoDB is running: `mongod`
- Or check your MongoDB Atlas connection string

 Issue: "Port 5000 already in use"
Solution:
- Kill the process: `lsof -ti:5000 | xargs kill -9`
- Or change port in .env

 Issue: "Module not found"
**Solution:**
- Delete node_modules and package-lock.json
- Run `npm install` again

 Next Steps

1. Change admin password after first login
2. Create additional user accounts
3. Upload your certificate data
4. Customize certificate design (pdfGenerator.js)
5. Deploy to production (see README.md)

 Need Help?

Check the full README.md for:
- Complete API documentation
- Security features
- Production deployment
- Advanced configuration