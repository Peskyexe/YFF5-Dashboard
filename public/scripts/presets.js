import { loadModules } from "./modules.js";

const presetDropdownItems = document.querySelectorAll(".dropdown-item")
var activePreset = { };

const defaultPresetId = "0";

let presetId = localStorage.getItem("presetId");
if (!presetId) {
    presetId = defaultPresetId;
}

activePreset = await getPreset(presetId);


// Funksjon for å hente in en preset fra serveren ved bruk av egen API
async function getPreset(id) {
    const response = await fetch(`/api/core/preset?id=${id}`);

    if (!response.ok) {
        throw new Error("Network error");
    }

    const data = await response.json();
    return data;
}


// Funksjon som endrer det aktive presete
async function changeActivePreset(newPresetId) {
    localStorage.setItem("presetId", newPresetId);
    activePreset = await getPreset(newPresetId);
}


// Funksjon for å gjøre om moduler objektet til en array
function createModulesArray(preset) {
    const modulesArray = Object.values(preset.modules);
    return modulesArray
}


presetDropdownItems.forEach(item => {
    item.addEventListener('click', async (event) => {
        event.stopPropagation();

        const value = item.dataset.value;

        await changeActivePreset(value.toString())
        loadModules(activePreset);
    })
})

export { activePreset, createModulesArray };