import React, { useState, useEffect } from "react";
import {
	Paper,
	Box,
	Typography,
	Button,
	IconButton,
	LinearProgress,
	Alert,
	Breadcrumbs,
	Link,
	Dialog,
	DialogContent,
} from "@mui/material";
import { Upload, FolderUp, File, Trash2, Download, Eye, Image as ImageIcon, FileText } from "lucide-react";
import { FileList } from "./FileList";
import { FileUploadDialog } from "./FileUploadDialog";
import { FilePreview } from "./FilePreview";
import { useStorageManager } from "../../hooks/useStorageManager";

export function FileBrowser({ companyId }) {
	const [currentPath, setCurrentPath] = useState("");
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [previewFile, setPreviewFile] = useState(null);
	const { files, loading, error, uploadFile, downloadFile, deleteFile, listFiles, getFileUrl } =
		useStorageManager(companyId);

	useEffect(() => {
		if (companyId) {
			listFiles(currentPath);
		}
	}, [companyId, currentPath, listFiles]);

	const handlePathChange = (newPath) => {
		setCurrentPath(newPath);
	};

	const handleUpload = async (file) => {
		try {
			await uploadFile(file, currentPath);
			await listFiles(currentPath);
		} catch (err) {
			console.error("Upload error:", err);
		}
	};

	const handleDownload = async (file) => {
		try {
			await downloadFile(file);
		} catch (err) {
			console.error("Download error:", err);
		}
	};

	const handleDelete = async (file) => {
		if (window.confirm("Are you sure you want to delete this file?")) {
			try {
				await deleteFile(file);
				await listFiles(currentPath);
			} catch (err) {
				console.error("Delete error:", err);
			}
		}
	};

	const handlePreview = async (file) => {
		try {
			const url = await getFileUrl(file.key);
			setPreviewFile({ ...file, url });
		} catch (err) {
			console.error("Preview error:", err);
		}
	};

	const renderBreadcrumbs = () => {
		const paths = currentPath.split("/").filter(Boolean);
		return (
			<Breadcrumbs sx={{ mb: 2 }}>
				<Link component='button' variant='body1' onClick={() => setCurrentPath("")} underline='hover'>
					Root
				</Link>
				{paths.map((path, index) => {
					const fullPath = paths.slice(0, index + 1).join("/");
					return (
						<Link
							key={fullPath}
							component='button'
							variant='body1'
							onClick={() => setCurrentPath(fullPath)}
							underline='hover'
						>
							{path}
						</Link>
					);
				})}
			</Breadcrumbs>
		);
	};

	return (
		<Paper sx={{ p: 3 }}>
			{loading && <LinearProgress sx={{ mb: 2 }} />}

			{error && (
				<Alert severity='error' sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
				<Box>{renderBreadcrumbs()}</Box>
				<Button variant='contained' startIcon={<Upload />} onClick={() => setUploadDialogOpen(true)}>
					Upload Files
				</Button>
			</Box>

			<FileList
				files={files}
				onNavigate={handlePathChange}
				onDownload={handleDownload}
				onDelete={handleDelete}
				onPreview={handlePreview}
			/>

			<FileUploadDialog
				open={uploadDialogOpen}
				onClose={() => setUploadDialogOpen(false)}
				onUpload={handleUpload}
				currentPath={currentPath}
			/>

			<FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
		</Paper>
	);
}
