// Ruter for de forskjelige modulene sine APIer

const express = require('express');
const router = express.Router();

const { getWeather } = require("../apis/modules/weatherapp_api");


// API for å hente in været i Drammen
router.get("/weatherapp/weather", async (request, response) => {
    try {
        const weather = await getWeather();
        response.json(weather);
    } catch (error) {
        console.log(error)
        response.status(500).json({ error: error.message });
    }
});


module.exports = router;