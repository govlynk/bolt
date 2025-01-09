import { Paper, Typography, Box } from '@mui/material';
import { formatDuration } from '../../utils/timeUtils';

export function TimeEntry({ entry }) {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 1, '&:hover': { boxShadow: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle1">{entry.description}</Typography>
          <Typography variant="body2" color="text.secondary">
            {entry.startTime.toLocaleTimeString()} -{' '}
            {entry.endTime?.toLocaleTimeString() || 'Running'}
          </Typography>
        </Box>
        <Typography variant="h6" fontFamily="monospace">
          {formatDuration(entry.duration)}
        </Typography>
      </Box>
    </Paper>
  );
}