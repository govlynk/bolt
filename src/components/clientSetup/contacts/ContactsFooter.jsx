import React from 'react';
import { Box, Button, Alert } from '@mui/material';

export function ContactsFooter({ onBack, onContinue, disabled, showEmailWarning }) {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button onClick={onBack}>Back</Button>
        <Button 
          variant="contained" 
          onClick={onContinue} 
          disabled={disabled}
        >
          Continue
        </Button>
      </Box>

      {showEmailWarning && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          At least one contact must have an email address to continue.
        </Alert>
      )}
    </>
  );
}