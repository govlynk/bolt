import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { CircleX } from "lucide-react";

import ReactPlayer from "react-player";

export function InfoSidebar({ open, onClose, questionInfo }) {
	const { title, backgroundInfo, videoUrl, resources } = questionInfo || {};

	return (
		<Drawer
			anchor='right'
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: { width: "400px" },
			}}
		>
			<Box sx={{ p: 3 }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
					<Typography variant='h6'>Additional Information</Typography>
					<IconButton onClick={onClose}>
						<CircleX />
					</IconButton>
				</Box>

				{videoUrl && (
					<Box sx={{ mb: 3 }}>
						<ReactPlayer url={videoUrl} width='100%' height='200px' controls />
					</Box>
				)}

				<Typography variant='h6' gutterBottom>
					{title}
				</Typography>

				<Typography variant='body1' paragraph>
					{backgroundInfo}
				</Typography>

				{resources && resources.length > 0 && (
					<>
						<Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
							Helpful Resources
						</Typography>
						<Box component='ul' sx={{ pl: 2 }}>
							{resources.map((resource, index) => (
								<Typography component='li' key={index}>
									<a
										href={resource.url}
										target='_blank'
										rel='noopener noreferrer'
										style={{ color: "#1976d2", textDecoration: "none" }}
									>
										{resource.title}
									</a>
								</Typography>
							))}
						</Box>
					</>
				)}
			</Box>
		</Drawer>
	);
}
