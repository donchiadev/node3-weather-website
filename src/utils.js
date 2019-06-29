const request = require("request")

const geocode = (address, callback) => {
  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(address) +
    ".json?access_token=pk.eyJ1IjoiYW1vbmRpY2UiLCJhIjoiY2p2ZGxhZ2cwMGViYzRkbzZxODg4cXliMyJ9.Ky71kKh9tUQiuTP9DvNnlA"
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback(error, undefined)
    } else if (body.features.length === 0) {
      callback("Unable to find location. Try another search.", undefined)
    } else {
      callback(undefined, {
        lat: body.features[0].center[1],
        lon: body.features[0].center[0],
        location: body.features[0].place_name
      })
    }
  })
}

const forecast = (lat, lon, callback) => {
  const url =
    "https://api.darksky.net/forecast/689aba38383251c3f01444be2a9e76f3/" +
    lat +
    "," +
    lon +
    "?units=si"
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service.", undefined)
    } else if (body.error) {
      callback("Unable to find location.", undefined)
    } else {
      callback(
        undefined,
        body.daily.data[0].summary +
          " it is currently " +
          body.currently.temperature +
          "° out. There is a " +
          body.currently.precipProbability +
          "% chance of rain. The humidity index is " +
          body.currently.humidity +
          "."
      )
    }
  })
}

module.exports = { geocode, forecast }
