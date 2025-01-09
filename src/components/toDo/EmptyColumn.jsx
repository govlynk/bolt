import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { MoveVertical } from 'lucide-react';

export function EmptyColumn({ status }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        height: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed',
        borderColor: isDark ? 'grey.700' : 'grey.300',
        borderRadius: 1,
        bgcolor: isDark ? 'grey.900' : 'background.paper',
        p: 2,
        opacity: 0.8,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          opacity: 1,
          borderColor: 'primary.main',
          transform: 'scale(1.02)',
          bgcolor: isDark ? 'grey.800' : 'background.paper',
        }
      }}
    >
      <MoveVertical 
        size={24} 
        style={{ 
          marginBottom: 8, 
          opacity: 0.5,
          transition: 'opacity 0.2s ease',
          color: theme.palette.text.secondary
        }} 
      />
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{
          transition: 'color 0.2s ease',
          '&:hover': {
            color: 'primary.main'
          }
        }}
      >
        Drop tasks here
      </Typography>
    </Box>
  );
}