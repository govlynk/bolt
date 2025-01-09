import { TextField, Box } from '@mui/material';

export function TimerInput({ description, setDescription }) {
  return (
    <Box sx={{ flexGrow: 1, mr: 2 }}>
      <TextField
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What are you working on?"
        variant="outlined"
        size="small"
      />
    </Box>
  );
}