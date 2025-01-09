import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Box, Typography, Button } from "@mui/material";
import Header from "../components/layout/Header";

const NotFoundPage = () => {
	return (
		<Box margin='20px' paddingRight='20px' height='80vh'>
			<Header title='Not Found' subtitle='' />
			<Box
				sx={{
					textAlign: "center",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "24rem",
				}}
			>
				<AlertTriangle sx={{ color: "orange", fontSize: "6rem", mb: 4 }} />
				<Typography variant='h1' sx={{ fontSize: "6rem", fontWeight: "bold", mb: 4 }}>
					404 Not Found
				</Typography>
				<Typography variant='body1' sx={{ fontSize: "1.25rem", mb: 5 }}>
					This page does not exist
				</Typography>
				<Button
					component={Link}
					to='/dashboard'
					sx={{
						color: "white",
						backgroundColor: "indigo.700",
						"&:hover": { backgroundColor: "indigo.900" },
						borderRadius: "0.375rem",
						px: 3,
						py: 2,
						mt: 4,
					}}
				>
					Go Back
				</Button>
			</Box>
		</Box>
	);
};

export default NotFoundPage;
