import React, { useRef, useState } from "react";
import {
	Box,
	Typography,
	Button,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	LinearProgress,
	FormHelperText,
	Alert,
} from "@mui/material";
import { Upload, X, FileText, Image, File, Info } from "lucide-react";

export function FileUploadQuestion({ question, value = [], onChange, onInfoClick }) {
	const fileInputRef = useRef();
	const [error, setError] = useState("");
	const [uploading, setUploading] = useState(false);

	const getFileIcon = (fileType) => {
		if (fileType.startsWith("image/")) return <Image size={20} />;
		if (fileType.includes("pdf")) return <FileText size={20} />;
		return <File size={20} />;
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
	};

	// ... rest of the component implementation remains the same ...

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
				<Typography variant='h6'>
					{question.title}
					{question.required && <span style={{ color: "error.main" }}> *</span>}
				</Typography>
				{question?.info && (
					<IconButton size='small' onClick={() => onInfoClick?.(question)}>
						<Info size={20} />
					</IconButton>
				)}
			</Box>

			{/* Rest of the component JSX remains the same */}
		</Box>
	);
}
