import express from "express";
import mainRouter from "./routes";
import cors from "cors";

const app = express();
const PORT = 4000;
app.use(cors({
  origin: function(origin, callback){
    // Allow all origins in development
    if (!origin || 
        origin === 'http://localhost:5173' || 
        origin === 'https://highway-delite-ue66.onrender.com') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());


app.use("/api", mainRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
