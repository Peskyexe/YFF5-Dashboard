// Ruter for modul henting og presets APIer. Ikke for APIene som de forskjelige modulene bruker.

const express = require('express');
const router = express.Router();

const { getModule } = require("../apis/core/core_module_api");
const { getPreset } = require("../apis/core/core_preset_api");


// API for å last in en modul fra public/modules/ mappa
router.get("/module", async (request, response) => {
    try {
        const { id, index, version = "small" } = request.query;
        const moduleElement = await getModule(id, index, version);

        response.json({
            id,
            version,
            html: moduleElement.outerHTML
        });

    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});


// API for å hente in presets fra prestes/ mappa
router.get("/preset", async (request, response) => {
    try {
        const { id } = request.query;
        const json = await getPreset(id);

        response.json(json);

    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});


module.exports = router;