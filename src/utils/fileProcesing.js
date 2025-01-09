export const processFileMetadata = (file) => ({
	key: file.key,
	name: file.key.split("/").pop(),
	size: file.size,
	lastModified: file.lastModified,
	isFolder: file.size === 0 && file.key.endsWith("/"),
	contentType: file.contentType,
});

export const validateFileSize = (file, maxSize = 100 * 1024 * 1024) => {
	if (file.size > maxSize) {
		throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`);
	}
	return true;
};
