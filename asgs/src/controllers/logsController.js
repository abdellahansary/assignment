const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function insertLog(req, res) {
  try {
    const db = getDB();
    const { book_id, action } = req.body;

    const doc = {
      action,
      book_id: ObjectId.isValid(book_id) ? new ObjectId(book_id) : book_id
    };

    const result = await db.collection("logs").insertOne(doc);
    res.json({ acknowledged: result.acknowledged, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { insertLog };
