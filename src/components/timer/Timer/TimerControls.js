import { IconButton } from '@mui/material';
import { Play, Square } from 'lucide-react';

export function TimerControls({ isActive, onStart, onStop }) {
  return isActive ? (
    <IconButton onClick={onStop} color="error" size="large">
      <Square />
    </IconButton>
  ) : (
    <IconButton onClick={onStart} color="success" size="large">
      <Play />
    </IconButton>
  );
}