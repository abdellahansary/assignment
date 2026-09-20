const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/booksController");

// note: order matters here, the specific routes need to come before /:title
router.get("/title", findBookByTitle);
router.get("/year-integer", findBooksWithYearAsInteger);
router.get("/year", findBooksByYearRange);
router.get("/genre", findBooksByGenre);
router.get("/skip-limit", skipLimitBooks);
router.get("/exclude-genres", findBooksExcludingGenres);
router.delete("/before-year", deleteBooksBeforeYear);
router.get("/aggregate1", aggregate1);
router.get("/aggregate2", aggregate2);
router.get("/aggregate3", aggregate3);
router.get("/aggregate4", aggregate4);

router.post("/batch", insertManyBooks);
router.post("/", insertOneBook);
router.patch("/:title", updateBookYearByTitle);

module.exports = router;
