import Note from "../../DB/models/notes.model.js";



export const createNote = async (req, res, next) => {
  try {
    const { id } = req.query; // logged-in user's id from query params
    const { title, content } = req.body;
 
    const newNote = await Note.create({
      title,
      content,
      userId: id,
    });
 
    return res.status(201).json({
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
 export const updateNote = async (req, res, next) => {
  try {
    const { id, userId } = req.query;
    const { title, content } = req.body;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not allowed to update this note" });
    }

    if (title) note.title = title;
    if (content) note.content = content;

    const updatedNote = await note.save();

    res.status(200).json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    next();
  }
};
export const replaceNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.query;
    const { title, content } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not allowed to update this note" });
    }

    note.title = title;
    note.content = content;

    const replacedNote = await note.save();

    res.status(200).json({ message: "Note replaced successfully", note: replacedNote });
  } catch (error) {
    next();
  }
};
export const updateAllNotes = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const { title, content } = req.body;

    const updateResult = await Note.updateMany(
      { userId },
      { title, content },
      { runValidators: true }
    );

    res.status(200).json({ message: "Notes updated successfully", result: updateResult });
  } catch (error) {
    next();
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.query;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not allowed to delete this note" });
    }

    await note.deleteOne();

    res.status(200).json({ message: "Note deleted successfully", note });
  } catch (error) {
    next();
  }
};
export const paginateSortNotes = async (req, res, next) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;

    const userNotes = await Note
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      notes: userNotes,
    });
  } catch (error) {
    next();
  }
};
export const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not allowed to view this note" });
    }

    res.status(200).json({ note });
  } catch (error) {
    next(error);
  }
};
export const getNoteByContent = async (req, res, next) => {
  try {
    const { content } = req.query;

    const note = await Note.findOne({ content });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ note });
  } catch (error) {
    next(error);
  }
};
export const getNotesWithUserInfo = async (req, res, next) => {
  try {
    const { userId } = req.query;

    const userNotes = await Note
      .find({ userId })
      .select("title userId createdAt")
      .populate("userId", "email");

    res.status(200).json({ notes: userNotes });
  } catch (error) {
    next(error);
  }
};
export const getNotesAggregate = async (req, res, next) => {
  try {
    const { title } = req.query;

    const noteFilter = {};

    if (title) {
      noteFilter.title = { $regex: title, $options: "i" };
    }

    const matchingNotes = await Note.aggregate([
      { $match: noteFilter },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          title: 1,
          content: 1,
          createdAt: 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]);

    res.status(200).json({ notes: matchingNotes });
  } catch (error) {
    next(error);
  }
};
export const deleteAllNotes = async (req, res, next) => {
  try {
    const { userId } = req.query;

    const deleteResult = await Note.deleteMany({ userId });

    res.status(200).json({ message: "Notes deleted successfully", result: deleteResult });
  } catch (error) {
    next(error);
  }
};
