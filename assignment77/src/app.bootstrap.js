import express from "express";
import connectToDatabase from "./DB/connectionDB.js";
import userRouter from "./modules/users/users.controller.js";
import notesRouter from "./modules/notes/notes.controller.js";
const app = express();
const PORT = 3000;

const bootstrap = async () => {
  app.use(express.json());
  app.get("/", (req, res) => res.status(200).json({ message: "Hello, World!" }));

  await connectToDatabase();
  app.use("/user", userRouter);
  app.use("/notes", notesRouter);

 app.use("/*demo", (req, res) => res.status(404).json({ message: "Route not found" })); 
 app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
};
export default bootstrap;
