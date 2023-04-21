const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
    const response = { alive: true, at: (new Date()).toUTCString() };
    console.log('Sending health status', response);
    res.json(response);
});

module.exports = router;