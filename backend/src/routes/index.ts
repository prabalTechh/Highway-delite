import { Router } from "express";
import user from "./User";
import post from "./post";

const mainRouter = Router();

mainRouter.use("/user" , user);
mainRouter.use("/posts" , post);

export default mainRouter;