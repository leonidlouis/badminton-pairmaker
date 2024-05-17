"use client";

import { Box, Typography } from "@mui/material";
import { Toaster, ToastBar } from "react-hot-toast";

const Toast = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        error: {
          duration: 5000,
        },
        success: {
          duration: 2000,
          iconTheme: {
            primary: "green",
            secondary: "white",
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              <Box sx={{ pt: 0.25 }}>
                <Typography variant="subtitle2">{message}</Typography>
              </Box>
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default Toast;
