"use client";

import MuiIconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

const IconButton = styled(MuiIconButton)(({ theme, ...props }) => ({
  padding: 2,
  ...(props.variant === "primary" && {
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    "&:hover,&:active": {
      color: "#FFFFFF",
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(props.variant === "secondary" && {
    color: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.secondary.main}`,
    "&:hover,&:active": {
      color: "#FFFFFF",
      backgroundColor: theme.palette.secondary.main,
    },
  }),
  ...(props.variant === "warning" && {
    color: theme.palette.warning.main,
    border: `1px solid ${theme.palette.warning.main}`,
    "&:hover,&:active": {
      color: "#FFFFFF",
      backgroundColor: theme.palette.secondary.main,
    },
  }),
  ...(props.variant === "error" && {
    color: theme.palette.error.main,
    border: `1px solid ${theme.palette.error.main}`,
    "&:hover,&:active": {
      color: "#FFFFFF",
      backgroundColor: theme.palette.secondary.main,
    },
  }),
  "&.Mui-disabled": {
    border: `1px solid #808080`,
  },
}));

export default IconButton;
