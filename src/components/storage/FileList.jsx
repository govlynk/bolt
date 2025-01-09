import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Typography,
	Box,
} from "@mui/material";
import { Folder, File, Download, Trash2, Eye, Image as ImageIcon, FileText } from "lucide-react";

const getFileIcon = (file) => {
	if (file.isFolder) return <Folder />;

	const extension = file.key.split(".").pop()?.toLowerCase();
	switch (extension) {
		case "jpg":
		case "jpeg":
		case "png":
		case "gif":
			return <ImageIcon />;
		case "pdf":
			return <FileText />;
		case "txt":
		case "doc":
		case "docx":
			return <FileText />;
		default:
			return <File />;
	}
};

const formatFileSize = (bytes) => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export function FileList({ files, onNavigate, onDownload, onDelete, onPreview }) {
	const isPreviewable = (file) => {
		if (file.isFolder) return false;
		const extension = file.key.split(".").pop()?.toLowerCase();
		return ["jpg", "jpeg", "png", "gif", "pdf"].includes(extension);
	};

	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Size</TableCell>
						<TableCell>Last Modified</TableCell>
						<TableCell align='right'>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{files.length === 0 ? (
						<TableRow>
							<TableCell colSpan={4} align='center'>
								<Typography color='text.secondary'>No files found in this folder</Typography>
							</TableCell>
						</TableRow>
					) : (
						files.map((file) => (
							<TableRow key={file.key} hover>
								<TableCell>
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										{getFileIcon(file)}
										<Typography
											variant='body2'
											sx={{
												cursor: file.isFolder ? "pointer" : "default",
												"&:hover": file.isFolder
													? {
															textDecoration: "underline",
															color: "primary.main",
													  }
													: {},
											}}
											onClick={() => file.isFolder && onNavigate(file.key)}
										>
											{file.name}
										</Typography>
									</Box>
								</TableCell>
								<TableCell>{file.isFolder ? "-" : formatFileSize(file.size)}</TableCell>
								<TableCell>{new Date(file.lastModified).toLocaleString()}</TableCell>
								<TableCell align='right'>
									{!file.isFolder && (
										<>
											{isPreviewable(file) && (
												<IconButton size='small' onClick={() => onPreview(file)} title='Preview'>
													<Eye size={18} />
												</IconButton>
											)}
											<IconButton size='small' onClick={() => onDownload(file)} title='Download'>
												<Download size={18} />
											</IconButton>
											<IconButton size='small' onClick={() => onDelete(file)} color='error' title='Delete'>
												<Trash2 size={18} />
											</IconButton>
										</>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
