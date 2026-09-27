const express = require("express");
const router = express.Router();
const {
  createBooksCollection,
  createAuthorsCollection,
  createLogsCappedCollection,
  createBooksTitleIndex
} = require("../controllers/collectionController");

router.post("/books", createBooksCollection);
router.post("/authors", createAuthorsCollection);
router.post("/logs/capped", createLogsCappedCollection);
router.post("/books/index", createBooksTitleIndex);

module.exports = router;
