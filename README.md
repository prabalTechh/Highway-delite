**# Note Keeper

Note Keeper is a full-stack web application for creating, reading, updating, and deleting personal notes with user authentication.

## Deployed Link
[Highway Delite](https://highway-delite-sandy.vercel.app/)

## Features
- User registration and authentication
- Create, read, update, and delete notes
- Responsive design
- Secure user data management

## Tech Stack
### Frontend
- React
- Vite
- React Router DOM

### Backend
- Express.js
- Prisma ORM
- JSON Web Token (JWT)
- Bcrypt for password security

## Local Setup

### Prerequisites
- Node.js (v16+)
- npm

### Installation Steps
1. **Clone the Repository**
```bash
git clone https://github.com/your-username/note-keeper.git
cd note-keeper
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Create Environment File**
Create a `.env` file with:
```env
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
```

4. **Database Migrations**
```bash
npx prisma migrate dev
```

5. **Start Backend Server**
```bash
npm run dev
```

6. **Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev
```

## Folder Structure
```
note-keeper/
├── backend/
│   ├── prisma/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.jsx
```

## Contributing
Contributions are welcome! Please submit pull requests or open issues.**
