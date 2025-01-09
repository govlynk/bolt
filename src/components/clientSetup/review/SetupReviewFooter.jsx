import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { ArrowLeft, Check } from "lucide-react";

export function SetupReviewFooter({ onComplete, loading }) {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        mt: 4,
        pt: 3,
        borderTop: 1,
        borderColor: "divider"
      }}
    >
      <Button
        startIcon={<ArrowLeft />}
        onClick={() => window.history.back()}
        disabled={loading}
      >
        Back
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={onComplete}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <Check />}
      >
        {loading ? "Completing Setup..." : "Complete Setup"}
      </Button>
    </Box>
  );
}