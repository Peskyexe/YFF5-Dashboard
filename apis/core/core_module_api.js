const path = require('path');
const { JSDOM } = require( "jsdom");
const { readFile } = require("fs").promises;


const modules_directory = path.join(__dirname, "..", "..", "public", "modules");


async function getModule(id, index, version) {
    if (!id) {
        throw new Error("Missing id parameter");
    }
    if (!index) {
        throw new Error("Missing index parameter");
    }

    // Laster in modul filen
    const filePath = path.join(modules_directory, `${id}.html`);
    const html = await readFile(filePath, "utf8");
    if (!html) {
        throw new Error(`Module '${id}' not found`);
    }

    // Parser HTMLen
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Finner det riktig elemente 
    const moduleElement = document.querySelector(`.${version}`);
    if (!moduleElement) {
        throw new Error(`${id} version '${version}' not found`);
    }

    moduleElement.style.gridArea = `module-${index}`;
    return moduleElement;
}


module.exports = { getModule };