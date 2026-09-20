const { getDB } = require("../config/db");


async function createBooksCollection(req, res) {
  try {
    const db = getDB();
    await db.createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: {
              bsonType: "string",
              minLength: 1,
              description: "title is required and must be a non-empty string"
            }
          }
        }
      }
    });
    res.json({ ok: 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function createAuthorsCollection(req, res) {
  try {
    const db = getDB();
    const result = await db.collection("authors").insertOne(req.body);
    res.json({ acknowledged: result.acknowledged, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function createLogsCappedCollection(req, res) {
  try {
    const db = getDB();
    await db.createCollection("logs", {
      capped: true,
      size: 1024 * 1024 // 1MB
    });
    res.json({ ok: 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function createBooksTitleIndex(req, res) {
  try {
    const db = getDB();
    const indexName = await db.collection("books").createIndex({ title: 1 });
    res.json(indexName);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createBooksCollection,
  createAuthorsCollection,
  createLogsCappedCollection,
  createBooksTitleIndex
};
