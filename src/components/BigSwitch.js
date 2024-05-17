"use client";

import { Switch as MuiSwitch, styled } from "@mui/material";

const BigSwitch = styled((props) => (
  <MuiSwitch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
  />
))(({ theme }) => ({
  width: 52,
  height: 28,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 3,
    transitionDuration: "250ms",
    "&.Mui-checked": {
      transform: "translateX(24px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      border: "8px solid #fff",
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.3,
      cursor: "not-allowed",
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 28 / 2,
    opacity: 0.25,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default BigSwitch;
