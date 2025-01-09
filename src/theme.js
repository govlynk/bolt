import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
	palette: {
		mode: "light",
		background: {
			default: "#ffffff",
			paper: "#f5f5f5",
		},
		text: {
			primary: "#1a1a1a",
			secondary: "#666666",
		},
		chart: {
			colorPrimary: "rgba(25, 118, 210, 0.8)", // Deep blue
			colorSecondary: "rgba(211, 47, 47, 0.8)", // Vivid red
			strokes: ["#1976d2", "#d32f2f"],
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
				},
			},
		},
	},
});

export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		background: {
			default: "#000000",
			paper: "#1C1C1C",
		},
		text: {
			primary: "#ffffff",
			secondary: "#a0a0a0",
		},
		chart: {
			colorPrimary: "rgba(0, 229, 255, 0.8)", // Bright cyan
			colorSecondary: "rgba(255, 167, 38, 0.8)", // Warm orange
			strokes: ["#00e5ff", "#ffa726"],
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
				},
			},
		},
	},
});
