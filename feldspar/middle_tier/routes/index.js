const express = require("express");
const router = express.Router();

router.get("/api", (req, res) => {
    res.send({ alive: true, at: (new Date()).toUTCString() }).status(200);
});

module.exports = router;