const moduleContainer = document.querySelector(".module-container");
import { activePreset, createModulesArray } from "./presets.js";


loadModules(activePreset);


// Funksjon som laster in alle modulene basert på presete som blir tatt inn
async function loadModules(preset) {
    const modulesToLoad = createModulesArray(preset);
    let modulesHTML = "";
    
    let index;
    modulesToLoad.forEach(function(moduleObject, index) {
        const html = getModule(moduleObject, index + 1)
        html.then((value) => {
            modulesHTML += value;
            moduleContainer.innerHTML = modulesHTML;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = value;

            const scripts = tempDiv.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.type = script.type;
                newScript.defer = script.defer;

                document.head.appendChild(newScript);
            });
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
async function getModule(moduleObject, index) {
    const response = await fetch(`/api/core/module?id=${moduleObject.id}&version=${moduleObject.version}&index=${index}`);

    if (!response.ok) {
        throw new Error("Network error");
    }

    const data = await response.json();
    return data.html;
}


export { loadModules };