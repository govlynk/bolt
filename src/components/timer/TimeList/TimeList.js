import { Box } from '@mui/material';
import { useTimeStore } from '../../store/timeStore';
import { TimeEntry } from './TimeEntry';

export function TimeList() {
  const entries = useTimeStore((state) => state.entries);

  return (
    <Box sx={{ mt: 2 }}>
      {entries.map((entry) => (
        <TimeEntry key={entry.id} entry={entry} />
      ))}
    </Box>
  );
}