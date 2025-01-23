import { Router } from "express";
import user from "./User";

const mainRouter = Router();

mainRouter.use("/user" , user);
// mainRouter.use("/posts" , post);

export default mainRouter;