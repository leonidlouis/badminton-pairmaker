import { TableCell } from "@mui/material";

const BorderedTableCell = ({ children, sx, ...props }) => {
  return (
    <TableCell sx={{ border: `1px solid black`, ...sx }} {...props}>
      {children}
    </TableCell>
  );
};

export default BorderedTableCell;
