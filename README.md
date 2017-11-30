# 💡 LIFX + Dark Sky weather bulb

>Simple Node.js app for setting the colour of a LIFX bulb based on the current weather forecast

## About

This simple script:

- Loads the weather from Dark Sky for a given location (`LONGITUDE` and `LATITUDE` can be configured in your `.env` file)
- Connects to your LIFX bulb over the local network (LAN)
- Sets the colour of your LIFX bulb based on the `icon` property of the weather in 8 hours time

You could choose to run this script automatically every hour (or more / less frequently).


## Usage

- Duplicate `.env.example` to `.env` and fill in the values. You can get a Dark Sky API key [here](https://darksky.net/dev)
- Install the dependencies using `$ npm install` or `$ yarn`
- Run the script using `$ node index.js`