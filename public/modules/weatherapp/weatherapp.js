const weatherData = await getWeatherData();

async function getWeatherData() {
    const response = await fetch(`/api/modules/weatherapp/weather`);
    if (!response.ok) {
        throw new Error(`Server error`);
    }

    const data = await response.json();
    return data
}


const weatherIconBaseDirectory = "modules/weatherapp/weather_icons/";
let elementRefs = await loadElementRefs();

async function loadElementRefs() {
    try {
        const response = await fetch("modules/weatherapp/elementRefs.json");
        if (!response.ok) {
            throw new Error(`Unable to load elementRefs.json: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error loading element refs:", error);
    }   
}


// Kode for alt med "Været Nå" å gjøre
const currentContainers = document.querySelectorAll(".weatherapp-current");
const currentElements = getCurrentElementsByRefs(elementRefs.current, currentContainers);

currentElements.forEach(element => {
    updateCurrentWeather(element);
});

function getCurrentElementsByRefs(refs, containers) {
    let elements = [];

    containers.forEach(container => {
        let elementsObject = {};
        
        refs.forEach(reference => {
            elementsObject[reference.name] = container.querySelector(`.${reference.class}`);
        });

        elements.push(elementsObject);
    });

    return elements;
}

function updateCurrentWeather(elements) {
    const weather = weatherData[0];

    elements.temperature.innerText = weather.temperature;
    if (weather.temperatureRaw <= 0) {
        elements.temperature.classList.replace("weatherapp-positive", "weatherapp-negative");
    }

    elements.temperatureFeel.innerText = weather.temperatureFeel;
    if (weather.temperatureFeelRaw <= 0) {
        elements.temperatureFeel.classList.replace("weatherapp-positive", "weatherapp-negative");
    }
    
    elements.precipitationAvg.innerText = weather.precipitationAvg;
    elements.windSpeed.innerText = weather.windSpeed;
    elements.windGustSpeed.innerText = weather.windGustSpeed;
    elements.windDirection.style.transform = `rotate(${weather.windDirection}deg)`
}


// Kode for alt med tabelene å gjøre
const tableContainers = document.querySelectorAll(".weatherapp-table tbody");
const tableElements = getTableElementsByRefs(elementRefs.table, tableContainers);

tableElements.forEach(element => {
    updateTableWeather(element);
})

function getTableElementsByRefs(refs, tables) {
    let tablesElementsArray = []; // Tables

    // For each table
    tables.forEach(table => {
        let rowsElementsArray = []; 
        const rows = table.querySelectorAll("tr");

        rows.forEach(row => {
            let rowObject = {};
            
            refs.forEach(reference => {
                rowObject[reference.name] = row.querySelector(`.${reference.class}`);
            });

            rowsElementsArray.push(rowObject);
        });

        tablesElementsArray.push(rowsElementsArray);
    });

    return tablesElementsArray;
}

function updateTableWeather(table) {
    table.forEach(function(row, index) {
        updateTableRow(row, index);
    });
}

function updateTableRow(row, rowIndex) {
    const weather = weatherData[rowIndex];

    row.timeHour.innerText = weather.timeHour;

    row.weather.src = `${weatherIconBaseDirectory}${weather.symbolCode}.svg`

    row.temperature.innerText = weather.temperature;
    if (weather.temperatureRaw <= 0) {
        row.temperature.classList.replace("weatherapp-positive", "weatherapp-negative");
    }
    
    row.precipitationFull.innerText = weather.precipitationFull;
    row.windFull.innerText = weather.windFull;
    row.windDirection.style.transform = `rotate(${weather.windDirection}deg)`
}