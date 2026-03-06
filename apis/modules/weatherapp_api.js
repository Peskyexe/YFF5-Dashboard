const path = require('path');
const { readFile, writeFile, mkdir } = require("fs").promises;

// url for APIen til MET (Yr.no)
const BASE_URL = "https://api.met.no/weatherapi/locationforecast/2.0/complete";

// Kordinater for Drammen
const LATITUDE = 59.7439;
const LONGITUDE = 10.2045;

async function getWeather() {
    const cache = await getCache();
    const lastModified = cache["lastModified"];

    const headers = {
        "User-Agent": "personal-dashboard/0.1 jorgen.sundbye@gmail.com"
    }

    // Hvis lastModifed har en verdi så bruker vi den i forespørselen til MET
    if (lastModified) {
        headers["If-Modified-Since"] = lastModified;
    }

    return cache["data"];

    // Sender API forespørsel til MET
    const url = `${BASE_URL}?lat=${LATITUDE}&lon=${LONGITUDE}`
    const response = await fetch(url, { headers });

    // Hvis dataen ikke har endret seg så bruker vi cached data
    if (response.status === 304 && cache["data"]) {
        console.log("Using cached weather data (Not Modified)");
        return cache["data"];
    }

    // Hvis dataen har endret seg oppdatere vi cachen og bruker den nye dataen
    if (response.ok) {
        const rawData = await response.json();
        const filteredData = filterData(rawData);

        const newLastModified = response.headers.get("last-modified");
        if (newLastModified) {
            setCache(rawData, filteredData, newLastModified);
        }

        return filteredData;
    }

    throw new Error(`MET API error: ${response.status}`);
}

function filterTimeseriesData(timeseries) {
    // MET sin locationforecast 2.0 API lagrer tid i dette formate: 2020-06-10T13:04:26Z
    // Her endrer jeg bare 2020-06-10T13:04:26Z til 13.
    const time = timeseries["time"];
    const timeHour = time.substring(time.indexOf("T")+ 1, time.indexOf("T") + 3);

    // Id/Koden som lar meg oppdatere vær ikonet med hjelp fra MET sine apier
    const symbolCode = timeseries.data.next_1_hours.summary.symbol_code;

    // Temperature data
    const temperatureRaw = Math.round(timeseries.data.instant.details.air_temperature);
    const temperatureFeelRaw = Math.round(timeseries.data.instant.details.air_temperature_percentile_10);
    const temperature = `${temperatureRaw}°`;
    const temperatureFeel = `${temperatureFeelRaw}°`;

    // Regn data
    const precipitationMin = timeseries.data.next_1_hours.details.precipitation_amount_min;
    const precipitationMax = timeseries.data.next_1_hours.details.precipitation_amount_max;
    let precipitationFull = "";
    let precipitationAvg = 0;
    
    // hvis begge verdiene ikke er 0 så regner ut gjennomsnitte og fyller ut precipitationFull
    if (!(precipitationMin == 0 && precipitationMax == 0)){
        precipitationAvg = (precipitationMin + precipitationMax) / 2;
        precipitationFull = `${precipitationMin} - ${precipitationMax}`
    }

    const windSpeed =  Math.round(timeseries.data.instant.details.wind_speed);
    const windGustSpeed = Math.round(timeseries.data.instant.details.wind_speed_of_gust);
    const windFull = `${windGustSpeed}(${windGustSpeed})`;
    const windDirectionRaw = timeseries.data.instant.details.wind_from_direction;
    const windDirection = windDirectionRaw + 180;

    let filteredData = {
        time,
        timeHour,
        symbolCode,
        temperatureRaw,
        temperatureFeelRaw,
        temperature,
        temperatureFeel,
        precipitationFull,
        precipitationAvg,
        windSpeed,
        windGustSpeed,
        windFull,
        windDirection
    };

    return filteredData;
}

function filterData(data, timeRange = 8) {
    let filteredData = [];
    for (let i = 0; i < timeRange; i++) {
        filteredData[i] = filterTimeseriesData(data["properties"]["timeseries"][i])
    }

    return filteredData
}


// Caching logic
const cacheDirectory = path.join(__dirname, "..", "..", "caches");

async function getCache() {
    try {
        // Sikrer at cachen eksisterer 
        await mkdir(cacheDirectory, { recursive: true });
        
        const cacheFile = await readFile(path.join(cacheDirectory, "weatherapp_cache.json"), "utf8");
        const cache = JSON.parse(cacheFile);
        return cache;
    } catch (error) {
        return false;
    }
}

function setCache(rawData, data, lastModified) {
    const cacheObject = {
        lastModified,
        data,
        rawData
    };

    writeFile(path.join(cacheDirectory, "weatherapp_cache.json"), JSON.stringify(cacheObject, null, 4), "utf8");
}


module.exports = { getWeather };