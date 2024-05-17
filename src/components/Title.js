import { Typography } from "@mui/material";

const Title = ({ text = "" }) => {
  return (
    <Typography variant="h6" fontWeight={600}>
      {text}
    </Typography>
  );
};

export default Title;
