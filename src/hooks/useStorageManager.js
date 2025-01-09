import { uploadData, getUrl, remove, list } from "aws-amplify/storage";
import { getCompanyStoragePath, validateStoragePath } from "../utils/storage/storageUtils";
import { useState, useCallback } from "react";

export function useStorageManager(companyId) {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const listFiles = useCallback(
		async (path = "") => {
			if (!companyId) {
				setError("Company ID is required");
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const storagePath = getCompanyStoragePath(companyId, path);
				const result = await list({
					prefix: storagePath,
					options: {
						accessLevel: "private",
					},
				});

				const processedFiles = result.items.map((item) => ({
					key: item.key,
					name: item.key.split("/").pop(),
					size: item.size,
					lastModified: item.lastModified,
					isFolder: item.size === 0 && item.key.endsWith("/"),
				}));

				setFiles(processedFiles);
			} catch (err) {
				console.error("Error listing files:", err);
				setError(err.message || "Failed to list files");
			} finally {
				setLoading(false);
			}
		},
		[companyId]
	);

	const uploadFile = async (file, path = "") => {
		setError(null);
		try {
			const key = getCompanyPath(path + file.name);
			await uploadData({
				key,
				data: file,
				options: {
					contentType: file.type,
				},
			});
		} catch (err) {
			console.error("Error uploading file:", err);
			setError("Failed to upload file");
			throw err;
		}
	};

	const downloadFile = async (file) => {
		setError(null);
		try {
			const url = await getUrl({
				key: file.key,
				options: {
					accessLevel: "private",
					download: true,
				},
			});

			// Create a temporary link to download the file
			const link = document.createElement("a");
			link.href = url.url;
			link.download = file.name;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			console.error("Error downloading file:", err);
			setError("Failed to download file");
			throw err;
		}
	};

	const deleteFile = async (file) => {
		setError(null);
		try {
			await remove({
				key: file.key,
			});
		} catch (err) {
			console.error("Error deleting file:", err);
			setError("Failed to delete file");
			throw err;
		}
	};

	const getFileUrl = async (key) => {
		try {
			const result = await getUrl({
				key,
				options: {
					accessLevel: "private",
					validateObjectExistence: true,
				},
			});
			return result.url;
		} catch (err) {
			console.error("Error getting file URL:", err);
			throw err;
		}
	};

	return {
		files,
		loading,
		error,
		uploadFile,
		downloadFile,
		deleteFile,
		listFiles,
		getFileUrl,
	};
}
