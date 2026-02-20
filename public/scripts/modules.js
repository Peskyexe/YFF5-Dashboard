const moduleContainer = document.querySelector(".module-container");
import { activePreset, createModulesArray } from "./presets.js";


loadModules(activePreset);


// Funksjon som laster in alle modulene basert på presete som blir tatt inn
async function loadModules(preset) {
    const modulesToLoad = createModulesArray(preset);
    let modulesHTML = "";
    
    modulesToLoad.forEach(moduleObject => {
        const html = getModule(moduleObject)
        html.then((value) => {
            modulesHTML += value;
            moduleContainer.innerHTML = modulesHTML;
        })
    });

    // Lager noen strings som brukes til å skifte 'grid-template-areas'
    const row1Array = Object.values(preset["layout"]["row-1"]);
    let row1String = "";
    row1Array.forEach(element => {
        row1String += element + " ";
    });

    const row2Array = Object.values(preset["layout"]["row-2"]);
    let row2String = "";
    row2Array.forEach(element => {
        row2String += element + " ";
    });

    moduleContainer.style.gridTemplateAreas = `'${row1String}' '${row2String}'`; 
}


// Funksjon som henter in en module fra severen ved bruk av egen API
async function getModule(moduleObject) {
    const response = await fetch(`/api/module?id=${moduleObject.id}&version=${moduleObject.version}`);

    if (!response.ok) {
        throw new Error("Network error");
    }

    const data = await response.json();
    return data.html;
}


export { loadModules };