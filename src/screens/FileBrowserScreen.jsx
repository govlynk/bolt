import React from 'react';
import { Container, Typography, Alert, Box } from '@mui/material';
import { useGlobalStore } from '../stores/globalStore';
import { FileBrowser } from '../components/storage/FileBrowser';

export default function FileBrowserScreen() {
  const { activeCompanyId, activeCompanyData } = useGlobalStore();

  if (!activeCompanyId) {
    return (
      <Container maxWidth={false}>
        <Box sx={{ p: 4 }}>
          <Alert severity="warning">Please select a company to manage files</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
          File Manager
        </Typography>
        <FileBrowser companyId={activeCompanyId} />
      </Box>
    </Container>
  );
}