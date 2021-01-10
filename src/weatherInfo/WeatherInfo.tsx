import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles, Box, Paper, Theme, Typography } from "@material-ui/core";
import { BaseCSSProperties } from "@material-ui/core/styles/withStyles";
import { useSelector } from "react-redux";
import { selectCity, selectWeather } from "../features/main/citySlice";
import { degToCompass, tempToCelsius, windToMetric } from "../helpers/utils";
import { selectUnit } from "../features/header/unitSlice";
import cloud0 from "../images/cloud0.png";
import cloud1 from "../images/cloud1.png";
import cloud2 from "../images/cloud2.png";
import cloud3 from "../images/cloud3.png";
import cloud4 from "../images/cloud4.png";
import temp0 from "../images/temp0.png";
import temp1 from "../images/temp1.png";
import temp2 from "../images/temp2.png";
import temp3 from "../images/temp3.png";
import temp4 from "../images/temp4.png";
import temp5 from "../images/temp5.png";
import wind0 from "../images/wind0.png";
import wind1 from "../images/wind1.png";
import wind2 from "../images/wind2.png";

const WeatherInfo = () => {
  const styles = useStyles({} as StyleProps);

  const weatherInfo = useSelector(selectWeather);
  const selectedCity = useSelector(selectCity);
  const selectedUnit = useSelector(selectUnit);

  const tempSymbol =
    selectedUnit === "metric" ? "°C" : selectedUnit === "imperial" ? "℉" : "K";

  const windSymbol = selectedUnit === "imperial" ? "mph" : "km/h";
  const cloudsPerc = weatherInfo ? weatherInfo.weather.clouds.all : null;
  const cloudImg =
    cloudsPerc !== null
      ? cloudsPerc === 0
        ? cloud0
        : cloudsPerc > 0 && cloudsPerc <= 25
        ? cloud1
        : cloudsPerc > 25 && cloudsPerc <= 50
        ? cloud2
        : cloudsPerc > 50 && cloudsPerc <= 75
        ? cloud3
        : cloud4
      : null;

  const temp = weatherInfo
    ? tempToCelsius(weatherInfo.weather.temperature.actual, selectedUnit)
    : null;

  const tempImg =
    temp !== null
      ? temp < -20
        ? temp0
        : temp >= -20 && temp < 0
        ? temp1
        : temp >= 0 && temp < 10
        ? temp2
        : temp >= 10 && temp < 20
        ? temp3
        : temp >= 20 && temp < 30
        ? temp4
        : temp5
      : null;

  const windSp = weatherInfo
    ? windToMetric(weatherInfo.weather.wind.speed, selectedUnit)
    : null;
  const windImg =
    windSp !== null
      ? windSp < 10
        ? wind0
        : windSp >= 10 && windSp < 25
        ? wind1
        : wind2
      : null;

  if (!weatherInfo) {
    return <Box></Box>;
  }

  return (
    <Box>
      <Typography
        component="div"
        display="block"
        gutterBottom
        className={styles.popupItemTitle}
      >
        {selectedCity} - {weatherInfo.weather.summary.title}
      </Typography>
      {cloudImg && (
        <Box
          className={styles.img}
          style={{ backgroundImage: `url(${cloudImg})` }}
        ></Box>
      )}
      <Paper className={styles.paper} elevation={4}>
        <Typography component="div" variant="subtitle2">
          Cloud cover: {weatherInfo.weather.clouds.all}%
        </Typography>
        <Typography component="div" variant="subtitle2">
          Humidity: {weatherInfo.weather.clouds.humidity}%
        </Typography>
        <Typography component="div" variant="subtitle2">
          Visibility: {weatherInfo.weather.clouds.visibility}m
        </Typography>
      </Paper>
      {tempImg && (
        <Box
          className={styles.img}
          style={{ backgroundImage: `url(${tempImg})` }}
        ></Box>
      )}
      <Paper className={styles.paper} elevation={4}>
        <Typography component="div" variant="subtitle2">
          Current Temperature: {weatherInfo.weather.temperature.actual}{" "}
          {tempSymbol}
        </Typography>
        <Typography component="div" variant="subtitle2">
          Actual Feel: {weatherInfo.weather.temperature.feelsLike} {tempSymbol}
        </Typography>
      </Paper>
      {windImg && (
        <Box
          className={styles.img}
          style={{ backgroundImage: `url(${windImg})` }}
        ></Box>
      )}
      <Paper className={styles.paper} elevation={4}>
        <Typography component="div" variant="subtitle2">
          Wind Speed: {weatherInfo.weather.wind.speed} {windSymbol}
        </Typography>
        <Typography component="div" variant="subtitle2">
          Wind Direction: {degToCompass(weatherInfo.weather.wind.deg)}
        </Typography>
      </Paper>
    </Box>
  );
};

export default withRouter(WeatherInfo);

interface StyleProps {
  input: BaseCSSProperties | any;
  paper: BaseCSSProperties;
  img: BaseCSSProperties;
  popupItemTitle: BaseCSSProperties;
}

let baseStyle: StyleProps = {
  img: {
    backgroundRepeat: "no-repeat",
    height: 40,
    margin: "4px 0",
    backgroundPosition: "center",
    backgroundSize: "contain",
    borderRadius: 2,
  },
  popupItemTitle: {
    padding: 0,
    margin: 0,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  paper: {
    marginBottom: 12,
    padding: 4,
  },
  input: {
    color: "white",
    "& .MuiInput-underline:after": {
      transform: "scaleX(1) !important",
      borderBottom: "solid 2px white !important",
    },
  },
};
const useStyles = makeStyles<Theme, StyleProps>(() => baseStyle as any);
