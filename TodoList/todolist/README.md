# StudyOS - MERN Stack Todo App 📚

A full-stack web app for managing tasks, notes, goals, and study sessions.

## Tech Stack
- **Backend:** Node.js + Express.js + MongoDB
- **Frontend:** React + Vite + Tailwind CSS
- **Database:** MongoDB Atlas (cloud)
- **Hosting:** Render (backend) + Vercel (frontend)

## Features
✅ Task Management | ✅ Notes | ✅ Pomodoro Timer  
✅ Goals Tracking | ✅ Quiz System | ✅ Analytics | ✅ Dark Mode

## Quick Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI, JWT_SECRET, etc.
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

Visit: `http://localhost:5173`

## Environment Variables

**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/studyos
JWT_SECRET=your_secret_key_min_32_chars
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=StudyOS
```

## Deployment (FREE)

### 1. MongoDB Atlas
- Create cluster at mongodb.com
- Get connection string
- Add to backend .env

### 2. Backend → Render
- Push to GitHub
- Create Web Service on render.com
- Select backend folder
- Add environment variables

### 3. Frontend → Vercel
- Go to vercel.com
- Import GitHub repo
- Select frontend folder
- Add environment variables

## API Endpoints
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/tasks` - Get tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- (Same pattern for notes, goals, etc.)

## Scripts

**Backend:**
```bash
npm run dev    # Development
npm start      # Production
```

**Frontend:**
```bash
npm run dev      # Development
npm run build    # Build
npm run preview  # Preview
```

## Troubleshooting

**CORS Error?**
- Check `CLIENT_URL` in backend .env
- Check `VITE_API_URL` in frontend .env

**MongoDB Connection Failed?**
- Check connection string
- Verify IP whitelist in MongoDB Atlas

**Port in Use?**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

## Project Structure
```
todoist/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── [models, routes, controllers]
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
└── README.md
```

## License
ISC
