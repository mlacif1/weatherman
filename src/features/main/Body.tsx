import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles, Box, Paper, Theme, Button } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseCSSProperties } from "@material-ui/core/styles/withStyles";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faArrowCircleUp,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import LeafletMap from "../leafletmap/LeafletMap";
import TextSearch from "../textSearch/TextSearch";
import useWindowDimensions from "../../helpers/hooks";

const Body = () => {
  const styles = useStyles({} as StyleProps);

  const [panelDirection, setPanelDirection] = useState("middle");
  const { width } = useWindowDimensions();

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
  const isSmallScreen = width < 640;

  return (
    <Box
      className={`${styles.bodyContainer} ${
        isSmallScreen ? styles.smallBodyContainer : ""
      }`}
    >
      <Paper
        className={`${styles.paperContainer} ${
          panelDirection !== "left" ? styles.width60 : ""
        } ${panelDirection === "right" ? styles.fullWidth : ""} ${
          isSmallScreen ? styles.smallPaperContainer2 : ""
        }`}
        elevation={4}
      >
        {panelDirection !== "left" && <TextSearch />}
      </Paper>

      <Box className={styles.controlsContainer}>
        {panelDirection !== "left" && (
          <Button
            className={styles.collapseButton}
            onClick={() => onLeftClick()}
          >
            <FontAwesomeIcon
              icon={isSmallScreen ? faArrowCircleUp : faArrowCircleLeft}
              size="lg"
            />
          </Button>
        )}
        {panelDirection !== "right" && (
          <Button
            className={styles.collapseButton}
            onClick={() => onRightClick()}
          >
            <FontAwesomeIcon
              icon={isSmallScreen ? faArrowCircleDown : faArrowCircleRight}
              size="lg"
            />
          </Button>
        )}
      </Box>
      
      <Paper
        className={`${styles.paperContainer} ${
          panelDirection !== "right" ? styles.fullWidth : ""
        } ${isSmallScreen ? styles.smallPaperContainer1 : ""} ${
          isSmallScreen && panelDirection === "right"
            ? styles.smallPaperContainer11
            : ""
        }`}
        elevation={4}
      >
        {panelDirection !== "right" && <LeafletMap />}
      </Paper>
    </Box>
  );
};

export default withRouter(Body);

interface StyleProps {
  bodyContainer: BaseCSSProperties;
  paperContainer: BaseCSSProperties;
  smallBodyContainer: BaseCSSProperties;
  smallPaperContainer2: BaseCSSProperties;
  smallPaperContainer1: BaseCSSProperties;
  smallPaperContainer11: BaseCSSProperties;
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
  smallBodyContainer: {
    flexDirection: "column",
  },
  width60: {
    width: "60%",
    backgroundColor: "initial !important",
    minWidth: 240,
  },
  paperContainer: {
    padding: 12,
    backgroundColor: "lightGrey",
  },
  smallPaperContainer2: {
    width: "initial !important",
  },
  smallPaperContainer1: {
    width: "initial !important",
    height: 600,
  },
  smallPaperContainer11: {
    height: "initial",
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
