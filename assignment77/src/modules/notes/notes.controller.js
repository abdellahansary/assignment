import { Router } from "express";
import * as noteHandlers from "./notes.service.js";
const notesRouter = Router();

notesRouter.post("/newnote", noteHandlers.createNote)
notesRouter.patch("/update", noteHandlers.updateNote)
notesRouter.put("/replace/:noteId", noteHandlers.replaceNote);
notesRouter.put("/updateall", noteHandlers.updateAllNotes);
notesRouter.delete("/deletenote:noteId", noteHandlers.deleteNote);
notesRouter.get("/paginate-sort", noteHandlers.paginateSortNotes);
notesRouter.get("/getbyid:id", noteHandlers.getNoteById);
notesRouter.get("/note-by-content", noteHandlers.getNoteByContent);
notesRouter.get("/with-user-info", noteHandlers.getNotesWithUserInfo);
notesRouter.get("/aggregate", noteHandlers.getNotesAggregate);
notesRouter.delete("/deleteall", noteHandlers.deleteAllNotes);





export default notesRouter;
