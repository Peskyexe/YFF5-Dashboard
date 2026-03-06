// Ruter for alle sidene

const express = require('express');
const router = express.Router();
const path = require('path');


// Rute for index.html
router.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "..", "public", "index.html"));
});


module.exports = router;