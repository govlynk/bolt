import { Outlet } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import TopBar from "./TopBar";
import SidebarMenu from "./SidebarMenu";
import { useAuthStore } from "../../stores/authStore";

export default function MainLayout({ signOut }) {
	const theme = useTheme();
	const user = useAuthStore((state) => state.user);

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
				<TopBar user={user} signOut={signOut} />
				<Box
					component='main'
					sx={{
						flexGrow: 1,
						p: 3,
						overflow: "auto",
						backgroundColor: theme.palette.background.default,
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}
