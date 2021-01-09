import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  makeStyles,
  Box,
  Popper,
  Grow,
  ClickAwayListener,
  MenuItem,
  Paper,
  MenuList,
  Typography,
  Theme,
  AccordionDetails,
  Accordion,
  Tooltip,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logoImg from "../../images/icon.jpg";
import { BaseCSSProperties } from "@material-ui/core/styles/withStyles";
import { selectUnit, setUnit } from "./unitSlice";
import {
  faCaretDown,
  faRulerCombined,
} from "@fortawesome/free-solid-svg-icons";

const Header = (props: any) => {
  const unit = useSelector(selectUnit);

  const styles = useStyles({} as StyleProps);
  const dispatch = useDispatch();

  const [openUnit, setOpenUnit] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(true);
  const anchorUnitRef = useRef<HTMLDivElement>(null);

  const handleUnitToggle = () => {
    setOpenUnit((prevUnitOpen) => !prevUnitOpen);
  };

  const handleUnitClose = (event: any) => {
    if (anchorUnitRef.current && anchorUnitRef.current.contains(event.target)) {
      return;
    }

    setOpenUnit(false);
  };

  const handleUnitListKeyDown = (event: any) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenUnit(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const doSetUnit = (unit: any) => {
    dispatch(setUnit(unit));
    setOpenUnit(false);
  };

  return (
    <Accordion
      className={styles.fixed}
      expanded={panelExpanded}
      onChange={() => setPanelExpanded(!panelExpanded)}
    >
      <AccordionDetails className={styles.innerContainer}>
        <Box className={`${styles.innerDiv}`}>
          <Box className={styles.logo}></Box>
          <Box>
            <Tooltip placement="right" title="at your service">
              <Typography className={styles.title}>Weatherman</Typography>
            </Tooltip>
          </Box>
          <Box className={styles.unitContainer}>
            <div
              ref={anchorUnitRef}
              aria-controls={openUnit ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={handleUnitToggle}
            >
              <Tooltip title="Measurement" placement="bottom" arrow> 
                <Typography className={styles.text}>{unit}</Typography>
              </Tooltip>
              <FontAwesomeIcon size="lg" icon={faRulerCombined} />
              <FontAwesomeIcon className={styles.downIcon} icon={faCaretDown} />
            </div>
            <Popper
              open={openUnit}
              anchorEl={anchorUnitRef.current}
              role={undefined}
              transition
              disablePortal
              placement="bottom-end"
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleUnitClose}>
                      <MenuList
                        autoFocusItem={openUnit}
                        id="menu-list-grow"
                        onKeyDown={handleUnitListKeyDown}
                      >
                        <MenuItem
                          onClick={() => doSetUnit("metric")}
                          className={`${styles.unitMenuItem} ${
                            unit === "metric" ? styles.unitMenuSelected : ""
                          }`}
                        >
                          Metric
                        </MenuItem>
                        <MenuItem
                          onClick={() => doSetUnit("imperial")}
                          className={`${styles.unitMenuItem} ${
                            unit === "imperial" ? styles.unitMenuSelected : ""
                          }`}
                        >
                          Imperial
                        </MenuItem>
                        <MenuItem
                          onClick={() => doSetUnit("kelvin")}
                          className={`${styles.unitMenuItem} ${
                            unit === "kelvin" ? styles.unitMenuSelected : ""
                          }`}
                        >
                          Kelvin
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default withRouter(Header);

interface StyleProps {
  menuItem: BaseCSSProperties;
  text: BaseCSSProperties;
  menuItemSelected: BaseCSSProperties;
  acceptBtn: BaseCSSProperties;
  snackbar: BaseCSSProperties | any;
  toLeft: BaseCSSProperties;
  toRight: BaseCSSProperties;
  innerDiv: BaseCSSProperties;
  innerContainer: BaseCSSProperties | any;
  logo: BaseCSSProperties;
  fixed: BaseCSSProperties | any;
  boxContainer: BaseCSSProperties;
  unitContainer: BaseCSSProperties;
  downIcon: BaseCSSProperties;
  unitMenuItem: BaseCSSProperties;
  unitMenuSelected: BaseCSSProperties;
  title: BaseCSSProperties
}

let baseStyle: StyleProps = {
  menuItem: {
    padding: "12px 20px",
    whiteSpace: "nowrap",
    color: "#000000 !important",
    fontSize: 14,
    textTransform: "uppercase",
  },
  text: {
    display: "inline",
    textTransform: "capitalize",
    marginRight: 8,
    fontWeight: "bold",
  },
  title: {
    fontWeight: "bold"
  },
  menuItemSelected: {
    backgroundColor: "transparent !important",
    color: "#000000 !important",
    textDecoration: "underline",
  },
  acceptBtn: {
    color: "#36918e",
    fontWeight: "bold",
    borderRadius: 2,
  },
  snackbar: {
    "& .MuiSnackbarContent-action": {
      marginLeft: "initial",
      marginRight: "initial",
      paddingLeft: 0,
    },
  },

  toLeft: {
    justifyContent: "flex-start",
  },
  toRight: {
    justifyContent: "flex-end",
  },
  innerDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  innerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    height: "100%",
    //eslint-disable-next-line
    ["@media (max-width: 400px)"]: {
      position: "relative",
    },
  },
  logo: {
    backgroundImage: `url(${logoImg})`,
    backgroundRepeat: "no-repeat",
    width: 100,
    height: 40,
    margin: "4px 0",
    backgroundColor: "white",
    backgroundPosition: "center",
    backgroundSize: "contain",
    borderRadius: 2,
  },
  fixed: {
    top: 0,
    width: "100%",
    margin: "0 auto",
    left: 0,
    zIndex: "100",
    backgroundColor: "white",
    boxShadow:
      "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)",
  },
  boxContainer: {
    display: "flex",
  },
  unitContainer: {
    cursor: "pointer",
    marginLeft: 12,
    display: "flex",
  },
  downIcon: {
    marginLeft: 4,
    alignSelf: "center",
  },
  unitMenuItem: {
    borderBottom: "solid 1px #e8e8e8",
  },
  unitMenuSelected: {
    backgroundColor: "#ccc",
  },
};
const useStyles = makeStyles<Theme, StyleProps>(() => baseStyle as any);
