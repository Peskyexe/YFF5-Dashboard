const express = require("express");
const app = express();
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const path = require('path');
const { JSDOM } = require( "jsdom");
const { readFile, writeFile, mkdir } = require("fs").promises;

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));


// Pinger nettleseren når serveren har kobblet til
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});


// Middleware setup
app.use(connectLivereload());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// Rute for index.html
app.get("/", async (request, response) => {
    response.send( await readFile(path.join(__dirname, "public", "index.html"), "utf8"));
});


// API for å hente in moduler fra /modules mappa
app.get("/api/module", async (request, response) => {
    try {
        const { id, version = "small" } = request.query;
        const modules_directory = path.join(__dirname, "modules");

        if (!id) {
            return response.status(400).json({ error: "Missing id parameter" });
        }

        // Laster in modul filen
        const filePath = path.join(modules_directory, `${id}.html`);
        const html = await readFile(filePath, "utf8");

        // Parser HTMLen
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Finner det riktig elemente 
        const moduleElement = document.querySelector(`.${version}`);

        if (!moduleElement) {
            return response.status(404).json({
                error: `Module version '${version}' not found`
            });
        }

        // Return HTML
        response.json({
            id,
            version,
            html: moduleElement.outerHTML
        });

    } catch (error) {
        console.error(error);

        response.status(500).json({
            error: "Failed to load module"
        });
    }
});


// API for å hente in presets fra /prestes mappa
app.get("/api/preset", async (request, response) => {
    try {
        const { id } = request.query;
        const presets_directory = path.join(__dirname, "presets");

        if (!id) {
            return response.status(400).json({ error: "Missing id parameter" });
        }

        // Laster in presets filen
        const fileContent = await readFile(path.join(presets_directory, `preset_${id}.json`), "utf8");
        const json = JSON.parse(fileContent);

        // Returnerer JSON innholdet
        response.json(json);

    } catch (error) {
        console.error(error);

        response.status(500).json({
            error: "Failed to load preset"
        });
    }
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on http://localhost:3000/. To stop the server, press Ctrl + C");
});