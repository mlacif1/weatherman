export const degToCompass = (num) => {
  var val = Math.floor(num / 22.5 + 0.5);
  var arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr[val % 16];
};

export const tempToCelsius = (temp, unit) => {
  if (unit === "imperial") {
    return ((temp - 32) * 5) / 9;
  }
  if (unit === "kelvin") {
    return temp - 273.15;
  }
  return temp;
};

export const windToMetric = (wind, unit) => {
  if (unit === "imperial") {
    return wind * 1.609344;
  }
  return wind;
};
