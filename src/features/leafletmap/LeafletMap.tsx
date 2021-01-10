import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  Backdrop,
  Box,
  CircularProgress,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as Nominatim from "nominatim-browser";
import { BaseCSSProperties } from "@material-ui/core/styles/withStyles";

import L, { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import ReactDOMServer from "react-dom/server";
import {
  setCity,
  selectLoading,
  selectError,
  selectWeather,
  getWeatherForCity,
  selectCity,
} from "../main/citySlice";
import { selectUnit } from "../header/unitSlice";
// import Popup from "react-leaflet-editable-popup";
import { tempToCelsius, windToMetric } from "../../helpers/utils";

import cloud0 from "../../images/cloud0.png";
import cloud1 from "../../images/cloud1.png";
import cloud2 from "../../images/cloud2.png";
import cloud3 from "../../images/cloud3.png";
import cloud4 from "../../images/cloud4.png";
import temp0 from "../../images/temp0.png";
import temp1 from "../../images/temp1.png";
import temp2 from "../../images/temp2.png";
import temp3 from "../../images/temp3.png";
import temp4 from "../../images/temp4.png";
import temp5 from "../../images/temp5.png";
import wind0 from "../../images/wind0.png";
import wind1 from "../../images/wind1.png";
import wind2 from "../../images/wind2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import WeatherInfo from "../../weatherInfo/WeatherInfo";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const LeafletMap = () => {
  const selectedUnit = useSelector(selectUnit);
  const selectedCity = useSelector(selectCity);

  const weatherInfo = useSelector(selectWeather);

  const [selectedPositionWithZoom, setSelectedPositionWithZoom] = useState<
    [number, number, number, string]
  >([
    weatherInfo ? weatherInfo.coord.lat : null,
    weatherInfo ? weatherInfo.coord.lon : null,
    null,
    null,
  ]);

  useEffect(() => {
    if (
      selectedPositionWithZoom &&
      selectedPositionWithZoom[0] &&
      selectedPositionWithZoom[3] &&
      selectedCity.toLowerCase() !== selectedPositionWithZoom[3].toLowerCase()
    ) {
      dispatch(setCity(selectedPositionWithZoom[3].normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
      doFetchWeatherInfo(selectedPositionWithZoom[3].normalize("NFD").replace(/[\u0300-\u036f]/g, ""), selectedUnit);
    }
  }, [selectedPositionWithZoom, selectedUnit]);

  useEffect(() => {
    if (
      selectedPositionWithZoom &&
      selectedPositionWithZoom[0] &&
      selectedPositionWithZoom[3]
    ) {
      doFetchWeatherInfo(selectedPositionWithZoom[3].normalize("NFD").replace(/[\u0300-\u036f]/g, ""), selectedUnit);
    }
  }, [selectedUnit]);

  useEffect(() => {
    if (weatherInfo) {
      setSelectedPositionWithZoom([
        weatherInfo.coord.lat,
        weatherInfo.coord.lon,
        10,
        weatherInfo.name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      ]);
    }
  }, [weatherInfo]);

  const styles = useStyles({} as StyleProps);
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading);
  const errors = useSelector(selectError);

  if (errors) {
    alert(errors);
  }

  const doFetchWeatherInfo = async (city, unit) => {
    try {
      // @ts-ignore
      dispatch(getWeatherForCity({ city, unit }));
    } catch (err) {
      console.log(err);
    }
  };
  const Markers = (props: any) => {
    const map = useMapEvents({
      click(e) {
        Nominatim.reverseGeocode({
          lat: e.latlng.lat.toString(),
          lon: e.latlng.lng.toString(),
        }).then((resp: any) => {
          if (
            resp &&
            resp.address &&
            (resp.address.city || resp.address.town || resp.address.village)
          ) {
            const theCity = resp.address.city
              ? resp.address.city
              : resp.address.town
              ? resp.address.town
              : resp.address.village;
            props.setSelectedPositionWithZoom([
              e.latlng.lat,
              e.latlng.lng,
              map.getZoom(),
              theCity,
            ]);
          }
        });
      },
    });

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
    const tempImg = temp !== null
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
    const windImg = windSp !== null
      ? windSp < 10
        ? wind0
        : windSp >= 10 && windSp < 25
        ? wind1
        : wind2
      : null;

    const icon = divIcon({
      className: "custom-icon",
      html: ReactDOMServer.renderToString(
        cloudImg || windImg || tempImg ? (
          <Box className={styles.customMarkerBoxImgContainer}>
            {cloudImg && (
              <Box
                className={styles.customMarkerBoxImg}
                style={{ backgroundImage: `url(${cloudImg})` }}
              />
            )}
            {tempImg && (
              <Box
                className={styles.customMarkerBoxImg}
                style={{ backgroundImage: `url(${tempImg})` }}
              />
            )}
            {windImg && (
              <Box
                className={styles.customMarkerBoxImg}
                style={{ backgroundImage: `url(${windImg})` }}
              />
            )}
          </Box>
        ) : (
          <Box className={styles.customMarkerBox}>
            <FontAwesomeIcon icon={faQuestion} />
          </Box>
        )
      ),
    });

    return selectedPositionWithZoom && selectedPositionWithZoom[0] !== null ? (
      <Marker
        key={selectedPositionWithZoom[0]}
        position={[selectedPositionWithZoom[0], selectedPositionWithZoom[1]]}
        icon={icon}
      >
        {weatherInfo && (
          <Popup>
            <WeatherInfo />
          </Popup>
        )}
      </Marker>
    ) : null;
  };

  const ChangeMap = (props: any) => {
    const map = useMap();
    if (selectedPositionWithZoom[0] !== null) {
      map.setView(
        [selectedPositionWithZoom[0], selectedPositionWithZoom[1]],
        selectedPositionWithZoom[2]
      );
    } else {
      map.setView(props.center, props.zoom);
    }
    return null;
  };

  if (loading === "pending") {
    return (
      <Backdrop className={styles.backdrop} open={loading === "pending"}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Box className={styles.fullHeight}>
      <MapContainer className={styles.map}>
        <ChangeMap center={[47.06667, 21.93333]} zoom={10} />
        <Markers setSelectedPositionWithZoom={setSelectedPositionWithZoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        ></TileLayer>
      </MapContainer>
    </Box>
  );
};

export default withRouter(LeafletMap);

interface StyleProps {
  customMarkerBox: BaseCSSProperties;
  customMarkerBoxImg: BaseCSSProperties;
  map: BaseCSSProperties | any;
  fullHeight: BaseCSSProperties;
  backdrop: BaseCSSProperties | any;
  img: BaseCSSProperties;
  customMarkerBoxImgContainer: BaseCSSProperties;
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
  customMarkerBox: {
    fontSize: "large",
    backgroundColor: "white",
    padding: 12,
    display: "flex",
    justifyContent: "center",
    borderRadius: "50%",
    border: "solid 2px darkred",
  },
  customMarkerBoxImgContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: 120,
    backgroundColor: "grey",
    padding: 2,
  },
  customMarkerBoxImg: {
    backgroundRepeat: "no-repeat",
    height: 40,
    width: 40,
    margin: "0 2px",
    backgroundColor: "white",
    backgroundPosition: "center",
    backgroundSize: "contain",
    borderRadius: 2,
    border: "solid 1px",
  },
  map: {
    height: "100%",
  },
  fullHeight: {
    height: "100%",
  },
  backdrop: {
    position: "initial",
    height: "100%",
  },
};

const useStyles = makeStyles<Theme, StyleProps>(() => baseStyle as any);
