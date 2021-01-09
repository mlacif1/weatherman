import axios from "axios";

export const fetchWeatherForCity = (city, unit) => {
  const config = {
    crossdomain: true,
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
    },
  };

  const bodyParameters = {
    operationName: null,
    variables: {},
    query: `{
          getCityByName(name: "${city}", config: {units: ${unit}}) {
            country
            id
            name
            country
            coord{
              lon
              lat
            }
            weather {
              temperature {
                actual
                feelsLike
                min
                max
              }
              summary {
                title
                description
              }
              wind {
                speed
                deg
              }
              clouds {
                all
                visibility
                humidity
              }
            }
          }
        }`,
  };

  return axios.post(
    "https://graphql-weather-api.herokuapp.com/",
    bodyParameters,
    config
  );
};
