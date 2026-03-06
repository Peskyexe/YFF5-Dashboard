const path = require('path');
const { readFile } = require("fs").promises;


const presets_directory = path.join(__dirname, "..", "..", "presets");


async function getPreset(id) {
    if (!id) {
        throw new Error("Missing id parameter");
    }

    // Laster in presets filen
    const fileContent = await readFile(path.join(presets_directory, `preset_${id}.json`), "utf8");
    if (!fileContent) {
        throw new Error(`'preset_${id}' Does not exist`);
    }

    const json = JSON.parse(fileContent);
    return json;
}


module.exports = { getPreset };