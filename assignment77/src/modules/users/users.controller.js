import { Router } from "express";
import * as userHandlers from "./users.service.js";
const userRouter = Router();

userRouter.post("/signup", userHandlers.signup);
userRouter.post("/login", userHandlers.login); 
userRouter.put("/update", userHandlers.update);
userRouter.delete("/delete", userHandlers.deleteUser);
userRouter.get("/find", userHandlers.getUser);

export default userRouter;
