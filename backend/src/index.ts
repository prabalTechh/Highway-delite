import express from "express";
import mainRouter from "./routes";
import cors from "cors";

const app = express();
const PORT = 4000;
const corsOptions = {
  origin: 'https://highway-delite-ue66.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};
app.use(express.json());
app.use(cors());

app.use("/api", mainRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
