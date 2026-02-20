# Bus Booking Application

A modern, secure bus booking web application built with React.js frontend and Node.js + Express backend.

## Features

- 🔐 Secure JWT Authentication
- 🔍 Bus Search with Filters
- 💺 Interactive Seat Selection
- 📱 Mobile Responsive Design
- 🛡️ Security-First Architecture
- 💳 Booking & Payment System

## Tech Stack

### Frontend
- React.js with Vite
- React Router
- Axios for API calls
- Custom CSS with White Theme

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Helmet & CORS for security
- Rate limiting

## Project Structure

```
bus-booking-app/
├── frontend/          # React.js frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── styles/
│   └── public/
├── backend/           # Node.js backend
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── utils/
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
cd bus-booking-app
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start MongoDB (ensure it's running on localhost:27017)

2. Start the backend server
```bash
cd backend
npm start
```
The API will run on http://localhost:5000

3. Start the frontend development server
```bash
cd frontend
npm run dev
```
The app will run on http://localhost:5173

### Environment Variables

Backend (.env):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bus-booking
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=30d
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/search` - Search buses
- `GET /api/buses/:id` - Get bus details
- `GET /api/buses/:id/seats` - Get available seats
- `GET /api/buses/seed` - Seed sample buses

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/mybookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

## Security Features

- JWT Token Authentication
- bcrypt Password Hashing
- HTTP-only Cookies
- Helmet Security Headers
- CORS Configuration
- Rate Limiting
- Input Validation
- Protected Routes

## UI Theme

The application follows a clean white theme:
- Primary: #FFFFFF (white)
- Secondary: #F5F5F5 (light gray)
- Text: #111827 (dark)
- Accent: #2563EB (blue)
- Success: #22C55E (green)
- Error: #EF4444 (red)

## License

MIT
