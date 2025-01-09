import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box
} from '@mui/material';
import { X } from 'lucide-react';

export function FilePreview({ file, onClose }) {
  if (!file) return null;

  const extension = file.key.split('.').pop()?.toLowerCase();
  
  const renderPreview = () => {
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <img
            src={file.url}
            alt={file.name}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 200px)',
              objectFit: 'contain'
            }}
          />
        );
      case 'pdf':
        return (
          <iframe
            src={file.url}
            title={file.name}
            width="100%"
            height="calc(100vh - 200px)"
            style={{ border: 'none' }}
          />
        );
      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            Preview not available for this file type
          </Box>
        );
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {file.name}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {renderPreview()}
      </DialogContent>
    </Dialog>
  );
}