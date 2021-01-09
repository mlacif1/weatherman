import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import {
  makeStyles,
  Box,
  Paper,
  Theme,
  Button,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseCSSProperties } from "@material-ui/core/styles/withStyles";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import LeafletMap from "../leafletmap/LeafletMap";

const Body = (props: any) => {
  const styles = useStyles({} as StyleProps);

  const [panelDirection, setPanelDirection] = useState("middle");

  const onLeftClick = () => {
    if (panelDirection === "middle") {
      setPanelDirection("left");
    }
    if (panelDirection === "right") {
      setPanelDirection("middle");
    }
  };

  const onRightClick = () => {
    if (panelDirection === "middle") {
      setPanelDirection("right");
    }
    if (panelDirection === "left") {
      setPanelDirection("middle");
    }
  };

  return (
    <Box className={styles.bodyContainer}>
      <Paper
        className={`${styles.paperContainer} ${
          panelDirection !== "left" ? styles.fullWidth : ""
        }`}
        elevation={4}
      >
        {panelDirection !== "left" && <LeafletMap />}
      </Paper>
      <Box className={styles.controlsContainer}>
        {panelDirection !== "left" && (
          <Button
            className={styles.collapseButton}
            onClick={() => onLeftClick()}
          >
            <FontAwesomeIcon icon={faArrowCircleLeft} size="lg" />
          </Button>
        )}
        {panelDirection !== "right" && (
          <Button
            className={styles.collapseButton}
            onClick={() => onRightClick()}
          >
            <FontAwesomeIcon icon={faArrowCircleRight} size="lg" />
          </Button>
        )}
      </Box>

      <Paper
        className={`${styles.paperContainer} ${
          panelDirection !== "right" ? styles.width60 : ""
        } ${panelDirection === "left" ? styles.fullWidth : ""}`}
        elevation={4}
      >
        {panelDirection !== "right" && <div>This is the second div</div>}
      </Paper>
    </Box>
  );
};

export default withRouter(Body);

interface StyleProps {
  bodyContainer: BaseCSSProperties;
  paperContainer: BaseCSSProperties;
  collapseButton: BaseCSSProperties;
  controlsContainer: BaseCSSProperties;
  fullWidth: BaseCSSProperties;
  width60: BaseCSSProperties;
}

let baseStyle: StyleProps = {
  bodyContainer: {
    margin: 20,
    border: "solid 1px lightgrey",
    display: "flex",
    padding: 16,
    justifyContent: "space-between",
    borderRadius: 2,
    minHeight: "80vh",
  },
  width60: {
    width: "60%",
    backgroundColor: "initial !important",
  },
  paperContainer: {
    padding: 12,
    backgroundColor: "lightGrey",
  },
  fullWidth: {
    width: "100%",
    backgroundColor: "initial !important",
  },
  collapseButton: {
    fontSize: 15,
    color: "grey",
    zIndex: 10,
    width: 40,
    height: 40,
  },
  controlsContainer: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
  },
};
const useStyles = makeStyles<Theme, StyleProps>(() => baseStyle as any);
