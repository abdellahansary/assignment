const express = require("express");
const router = express.Router();
const { insertLog } = require("../controllers/logsController");

router.post("/", insertLog);

module.exports = router;
