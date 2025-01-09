import React from "react";
import { IconButton } from "@mui/material";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<IconButton
			onClick={toggleTheme}
			color='inherit'
			size='small'
			sx={{
				color: (theme) => (theme.palette.mode === "dark" ? "white" : "black"),
			}}
		>
			{theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
		</IconButton>
	);
};

export default ThemeToggle;
