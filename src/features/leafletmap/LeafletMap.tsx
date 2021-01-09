import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  Backdrop,
  Box,
  CircularProgress,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import {
//   setSelectedMarkerLocation,
//   setAgents,
//   setOrigoLocation,
// } from "../../actions/userAction";
import * as Nominatim from "nominatim-browser";
import { BaseCSSProperties } from "@material-ui/core/styles/withStyles";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import {
  selectCity,
  setCity,
  selectLoading,
  selectError,
  selectWeather,
  getWeatherForCity,
} from "../main/citySlice";
import { selectUnit } from "../header/unitSlice";
import Popup from "react-leaflet-editable-popup";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const LeafletMap = (props: any) => {
  const selectedUnit = useSelector(selectUnit);
  const selectedCity = useSelector(selectCity);

  const [selectedPositionWithZoom, setSelectedPositionWithZoom] = useState<
    [number, number, number, string]
  >([null, null, null, null]);

  useEffect(() => {
    if (
      selectedPositionWithZoom &&
      selectedPositionWithZoom[0] &&
      selectedPositionWithZoom[3]
    ) {
      dispatch(setCity(selectedPositionWithZoom[3]));
      doFetchWeatherInfo(selectedPositionWithZoom[3], selectedUnit);
    }
  }, [selectedPositionWithZoom]);

  const styles = useStyles({} as StyleProps);
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading);
  const weather = useSelector(selectWeather);
  const errors = useSelector(selectError);

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
            // dispatch(setCity(theCity));
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
    console.log(weather);

    return selectedPositionWithZoom && selectedPositionWithZoom[0] !== null ? (
      <Marker
        key={selectedPositionWithZoom[0]}
        position={[selectedPositionWithZoom[0], selectedPositionWithZoom[1]]}
      >
        {weather && (
          <Popup open>
            <Typography
              component="div"
              display="block"
              gutterBottom
              className={styles.popupItem}
            >
              {selectedPositionWithZoom[3]}
            </Typography>
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
        <Markers setSelectedPositionWithZoom={setSelectedPositionWithZoom}/>
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
  popupItem: BaseCSSProperties;
  customMarkerBox: BaseCSSProperties;
  pointer: BaseCSSProperties;
  block: BaseCSSProperties;
  expansionPanel: BaseCSSProperties | any;
  mainContainer: BaseCSSProperties;
  panelSummaryContainer: BaseCSSProperties | any;
  button: BaseCSSProperties;
  map: BaseCSSProperties | any;
  fullHeight: BaseCSSProperties;
  backdrop: BaseCSSProperties | any;
}

let baseStyle: StyleProps = {
  popupItem: {
    padding: 0,
    margin: 0,
    fontSize: 12,
  },
  customMarkerBox: {
    fontSize: "large",
    backgroundColor: "white",
    padding: 12,
    display: "flex",
    justifyContent: "center",
    borderRadius: "50%",
    border: "solid 4px darkred",
  },
  pointer: {
    cursor: "pointer",
    fontSize: 14,
    marginTop: 4,
  },
  expansionPanel: {
    margin: "20px 0",
  },
  block: {
    display: "block",
  },
  mainContainer: {
    marginBottom: 20,
  },
  panelSummaryContainer: {
    "& .MuiExpansionPanelSummary-content": {
      position: "relative",
    },
  },
  button: {
    color: "black",
    backgroundColor: "transparent",
    border: "solid 1px #36918e",
    borderRadius: 2,
    marginLeft: 12,
    padding: "6px 20px",
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
