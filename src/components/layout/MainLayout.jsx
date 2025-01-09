import { Outlet } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import TopBar from "./TopBar";
import SidebarMenu from "./SidebarMenu";
import { useGlobalStore } from "../../stores/globalStore";

export default function MainLayout({ signOut }) {
	const theme = useTheme();
	const { activeUserData } = useGlobalStore();

	return (
		<Box
			sx={{
				display: "flex",
				minHeight: "100vh",
				backgroundColor: theme.palette.background.default,
			}}
		>
			<SidebarMenu />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					flexGrow: 1,
					minHeight: "100vh",
					overflow: "hidden",
				}}
			>
				<TopBar />
				<Box
					component='main'
					sx={{
						flexGrow: 1,
						p: 3,
						overflow: "auto",
						// backgroundColor: theme.palette.background.default,
						background: (theme) =>
							theme.palette.mode === "dark" ? "linear-gradient(90deg, #016996 0%, #012f55 100%)" : "#bcd1f8",
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}
