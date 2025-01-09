import { useState } from 'react';
import { Paper, Box } from '@mui/material';
import { useTimeStore } from '../../store/timeStore';
import { TimerInput } from './TimerInput';
import { TimerControls } from './TimerControls';

export function Timer() {
  const [description, setDescription] = useState('');
  const { addEntry, stopTimer, activeEntry } = useTimeStore();

  const startTimer = () => {
    const entry = {
      id: crypto.randomUUID(),
      projectId: '',
      description,
      startTime: new Date(),
      duration: 0,
      tags: [],
    };
    addEntry(entry);
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TimerInput description={description} setDescription={setDescription} />
        <TimerControls
          isActive={!!activeEntry}
          onStart={startTimer}
          onStop={() => stopTimer(activeEntry.id)}
        />
      </Box>
    </Paper>
  );
}