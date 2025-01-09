import {
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	Typography,
	Box,
	IconButton,
} from "@mui/material";
import { Info } from "lucide-react";

export function YesNoQuestion({ question, value, onChange, onInfoClick }) {
	return (
		<FormControl component='fieldset' fullWidth>
			<FormLabel component='legend'>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Typography variant='h6' gutterBottom>
						{question.title}
					</Typography>
					{question?.info && (
						<IconButton size='small' onClick={() => onInfoClick?.(question)} sx={{ mb: 1 }}>
							<Info size={20} />
						</IconButton>
					)}
				</Box>
			</FormLabel>

			<Typography variant='body1' sx={{ mb: 3, color: "text.secondary" }}>
				{question.description}
			</Typography>

			<RadioGroup value={value || ""} onChange={(e) => onChange(question.id, e.target.value)}>
				<FormControlLabel value='Yes' control={<Radio />} label='Yes' />
				<FormControlLabel value='No' control={<Radio />} label='No' />
			</RadioGroup>
		</FormControl>
	);
}
