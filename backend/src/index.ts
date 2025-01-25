import express from "express";
import mainRouter from "./routes";
import cors from "cors";

const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());


app.use("/api", mainRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
