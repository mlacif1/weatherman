import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  makeStyles,
  Box,
  Theme,
  Button,
  TextField,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { BaseCSSProperties } from "@material-ui/core/styles/withStyles";
import WeatherInfo from "../../weatherInfo/WeatherInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  getWeatherForCity,
  selectCity,
  selectLoading,
  setCity,
} from "../main/citySlice";
import { selectUnit } from "../header/unitSlice";

const TextSearch = () => {
  const styles = useStyles({} as StyleProps);

  const selectedCity = useSelector(selectCity);
  const selectedUnit = useSelector(selectUnit);
  const [cityTxt, setCityTxt] = useState(selectedCity || "");
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);

  useEffect(() => {
    setCityTxt(selectedCity || "");
  }, [selectedCity]);

  useEffect(() => {
    // @ts-ignore
    dispatch(getWeatherForCity({ city: cityTxt.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), unit: selectedUnit }));
  }, [selectedUnit]);

  const getWeatherInfo = () => {
    try {
      if (cityTxt !== selectedCity) dispatch(setCity(cityTxt.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
      // @ts-ignore
      dispatch(getWeatherForCity({ city: cityTxt.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), unit: selectedUnit }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Box className={styles.boxContainer}>
        <TextField
          autoFocus
          margin="dense"
          id="id"
          label="City"
          fullWidth
          value={cityTxt}
          onChange={(e) => setCityTxt(e.target.value)}
          className={styles.input}
        />

        <Button
          disabled={cityTxt === ""}
          onClick={() => getWeatherInfo()}
          color="primary"
          autoFocus
          className={styles.actionButton}
        >
          Get Weather Info
        </Button>
      </Box>

      <Box>
        {loading === "pending" && (
          <Backdrop className={styles.backdrop} open={loading === "pending"}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        {loading === "idle" && <WeatherInfo />}
      </Box>
    </Box>
  );
};

export default withRouter(TextSearch);

interface StyleProps {
  boxContainer: BaseCSSProperties;
  input: BaseCSSProperties | any;
  actionButton: BaseCSSProperties;
  backdrop: BaseCSSProperties;
}

let baseStyle: StyleProps = {
  actionButton: {
    fontWeight: 700,
    border: "solid 1px",
    marginTop: 12,
  },
  input: {},
  boxContainer: {
    margin: 20,
    border: "solid 1px lightgrey",
    padding: 16,
    borderRadius: 2,
  },
  backdrop: {
    position: "initial",
    height: 280,
  },
};
const useStyles = makeStyles<Theme, StyleProps>(() => baseStyle as any);
