const { getDB } = require("../config/db");


async function insertOneBook(req, res) {
  try {
    const db = getDB();
    const result = await db.collection("books").insertOne(req.body);
    res.json({ acknowledged: result.acknowledged, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


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
