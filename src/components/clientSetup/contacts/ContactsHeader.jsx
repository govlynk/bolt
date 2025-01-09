import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { UserPlus } from 'lucide-react';

export function ContactsHeader({ onAddClick }) {
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Manage Contacts
      </Typography>
      <Button variant="contained" startIcon={<UserPlus />} onClick={onAddClick}>
        Add Contact
      </Button>
    </Box>
  );
}