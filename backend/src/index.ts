import express from "express";
import mainRouter from "./routes";

const app = express();
const PORT = 4000;

app.use(express.json());

app.use("/api", mainRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
