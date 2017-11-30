require('dotenv').config();

// Load in our config
const config = {
  darkSky: {
    apiKey: process.env.DARKSKY_KEY,
  },
  location: [process.env.LATITUDE, process.env.LONGITUDE],
};

// Create a LifxLan object
const Lifx = require('node-lifx-lan');

// Setup the forecast library
const Forecast = require('forecast');
const forecast = new Forecast({
  service: 'darksky',
  key: config.darkSky.apiKey,
  units: 'celcius',
  cache: true,
  ttl: {
    minutes: 27,
    seconds: 45,
  },
});

// Get the weather for a given location, and return it as a Promise
const getWeatherForLocation = location =>
  new Promise((resolve, reject) =>
    forecast.get(location, (err, weather) => {
      if (err) return reject(err);
      resolve(weather);
    })
  );

// Get the bulb colour based on the Dark Sky icon name
const getColourFromReport = ({ icon }) => {
  console.log(`The weather has been detected as "${icon}", setting light...`);
  switch (icon) {
    case 'clear-day':
      return {
        hue: 0.14166,
        saturation: 0.41999,
        brightness: 0.70999,
        kelvin: 2800,
      };
    case 'clear-night':
      return {
        hue: 0.69444,
        saturation: 0.36999,
        brightness: 0.55999,
        kelvin: 2800,
      };
    case 'rain':
      return {
        hue: 0.58054,
        saturation: 0.53999,
        brightness: 0.70999,
        kelvin: 2800,
      };
    case 'sleet':
    case 'snow':
      return {
        hue: 0.62499,
        saturation: 0.12,
        brightness: 0.70999,
        kelvin: 2800,
      };
    case 'tornado':
    case 'wind':
      break;
    case 'fog':
      break;
    case 'cloudy':
      return {
        hue: 0.59376,
        saturation: 0.04999,
        brightness: 0.561,
        kelvin: 3500,
      };
      break;
    case 'partly-cloudy-day':
      break;
    case 'partly-cloudy-night':
      break;
    case 'thunderstorm':
      break;
    case 'hail':
      break;
    default:
      return {
        red: 1,
        green: 0,
        blue: 0,
        kelvin: 6000,
      };
  }
};

/**
 * Find the bulb, load the weather, and set the appropriate colour
 */
Promise.all([Lifx.discover(), getWeatherForLocation(config.location)])
  .then(([devices, weather]) => {
    // Get the bulb
    // @TODO: This doesn't seem reliable enough...
    const bulb = devices[0];

    // Select the hourly weather for 8 hours ahead
    const weatherReport = weather.hourly.data[8];

    // Get the colour
    const colour = getColourFromReport(weatherReport);

    return bulb.turnOn({
      color: colour,
      duration: 4000,
    });
  })
  .then(() => process.exit())
  .catch(err => {
    console.log({ err });
    process.exit();
  });

/**
 * This can be used to load the colour from a bulb, which is useful for configuring the icon > colour mapping above
 */
// Lifx.discover()
//   .then(devices => {
//     const bulb = devices[0];

//     return bulb.getLightState();
//   })
//   .then(state => {
//     console.log({ state });
//     process.exit();
//   });
