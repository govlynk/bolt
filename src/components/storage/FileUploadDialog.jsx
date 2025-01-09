import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { Upload, File, X } from 'lucide-react';

export function FileUploadDialog({ open, onClose, onUpload, currentPath }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleFileSelect = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      for (const file of files) {
        await onUpload(file);
      }
      setFiles([]);
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Files</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current folder: {currentPath || 'Root'}
          </Typography>
          
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            sx={{ mt: 1 }}
          >
            Select Files
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            multiple
          />
        </Box>

        {files.length > 0 && (
          <List>
            {files.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveFile(index)}
                    disabled={uploading}
                  >
                    <X size={18} />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <File size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(2)} KB`}
                />
              </ListItem>
            ))}
          </List>
        )}

        {uploading && <LinearProgress sx={{ mt: 2 }} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={files.length === 0 || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}