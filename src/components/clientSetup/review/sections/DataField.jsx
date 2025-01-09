import React from "react";
import { Box, Typography } from "@mui/material";

export function DataField({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1">
        {value || "-"}
      </Typography>
    </Box>
  );
}