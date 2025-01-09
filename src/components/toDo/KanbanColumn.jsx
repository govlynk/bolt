import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';

const COLUMN_COLORS = {
  todo: 'grey.100',
  'in-progress': 'info.50',
  done: 'success.50'
};

export function KanbanColumn({ id, title, todos = [], children }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column',
      accepts: ['task']
    }
  });

  return (
    <Box sx={{ height: '100%', minHeight: '200px' }}>
      <Paper
        ref={setNodeRef}
        sx={{
          p: 2,
          bgcolor: COLUMN_COLORS[id] || 'grey.100',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: '200px',
          transition: 'all 0.2s ease',
          outline: isOver ? '2px solid' : 'none',
          outlineColor: 'primary.main',
        }}
      >
        <Typography
          variant="h6"
          sx={{ 
            mb: 2, 
            px: 1, 
            py: 0.5,
            borderRadius: 1,
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {title}
          <Typography 
            component="span" 
            variant="caption" 
            sx={{ 
              bgcolor: 'grey.200',
              px: 1,
              py: 0.5,
              borderRadius: 1
            }}
          >
            {(todos || []).length}
          </Typography>
        </Typography>

        <Box 
          sx={{ 
            flexGrow: 1,
            minHeight: '100px',
            transition: 'background-color 0.2s ease',
            borderRadius: 1,
            p: 1,
            bgcolor: isOver ? 'action.hover' : 'transparent'
          }}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
}