const { getDB } = require("../config/db");

// POST /books
async function insertOneBook(req, res) {
  try {
    const db = getDB();
    const result = await db.collection("books").insertOne(req.body);
    res.json({ acknowledged: result.acknowledged, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /books/batch
async function insertManyBooks(req, res) {
  try {
    const db = getDB();
    const books = req.body;
    if (!Array.isArray(books) || books.length < 3) {
      return res.status(400).json({ error: "send an array of at least 3 books" });
    }
    const result = await db.collection("books").insertMany(books);
    res.json({ acknowledged: result.acknowledged, insertedIds: result.insertedIds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PATCH /books/:title  -> e.g. /books/Future  { "year": 2022 }
async function updateBookYearByTitle(req, res) {
  try {
    const db = getDB();
    const { title } = req.params;
    const { year } = req.body;
    const result = await db
      .collection("books")
      .updateOne({ title }, { $set: { year } });
    res.json({
      acknowledged: result.acknowledged,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /books/title?title=Brave New World
async function findBookByTitle(req, res) {
  try {
    const db = getDB();
    const { title } = req.query;
    const book = await db.collection("books").findOne({ title });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /books/year?from=1990&to=2010
async function findBooksByYearRange(req, res) {
  try {
    const db = getDB();
    const from = Number(req.query.from);
    const to = Number(req.query.to);
    const books = await db
      .collection("books")
      .find({ year: { $gte: from, $lte: to } })
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /books/genre?genre=Science Fiction
async function findBooksByGenre(req, res) {
  try {
    const db = getDB();
    const { genre } = req.query;
    const books = await db.collection("books").find({ genres: genre }).toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /books/skip-limit -> skip 2, limit 3, sort year desc
async function skipLimitBooks(req, res) {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .find({})
      .sort({ year: -1 })
      .skip(2)
      .limit(3)
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /books/year-integer -> year stored as an actual int
async function findBooksWithYearAsInteger(req, res) {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .find({ year: { $type: "int" } })
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /books/exclude-genres -> no Horror, no Science Fiction
async function findBooksExcludingGenres(req, res) {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .find({ genres: { $nin: ["Horror", "Science Fiction"] } })
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /books/before-year?year=2000
async function deleteBooksBeforeYear(req, res) {
  try {
    const db = getDB();
    const year = Number(req.query.year);
    const result = await db.collection("books").deleteMany({ year: { $lt: year } });
    res.json({ acknowledged: result.acknowledged, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /books/aggregate1 -> after 2000, sorted year desc
async function aggregate1(req, res) {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $sort: { year: -1 } }
      ])
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /books/aggregate2 -> after 2000, only title/author/year
async function aggregate2(req, res) {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $project: { _id: 0, title: 1, author: 1, year: 1 } }
      ])
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /books/aggregate3 -> unwind genres
async function aggregate3(req, res) {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .aggregate([
        { $unwind: "$genres" },
        { $project: { _id: 0, title: 1, genres: 1 } }
      ])
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /books/aggregate4 -> join logs with books
async function aggregate4(req, res) {
  try {
    const db = getDB();
    const logs = await db
      .collection("logs")
      .aggregate([
        {
          $lookup: {
            from: "books",
            localField: "book_id",
            foreignField: "_id",
            as: "book_details"
          }
        },
        { $project: { _id: 0, action: 1, "book_details.title": 1, "book_details.author": 1, "book_details.year": 1 } }
      ])
      .toArray();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  insertOneBook,
  insertManyBooks,
  updateBookYearByTitle,
  findBookByTitle,
  findBooksByYearRange,
  findBooksByGenre,
  skipLimitBooks,
  findBooksWithYearAsInteger,
  findBooksExcludingGenres,
  deleteBooksBeforeYear,
  aggregate1,
  aggregate2,
  aggregate3,
  aggregate4
};
