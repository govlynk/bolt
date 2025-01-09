import { EditorState, convertToRaw, convertFromRaw, ContentState } from "draft-js";

export const createEditorState = (value) => {
	if (!value) {
		return EditorState.createEmpty();
	}

	try {
		// Try parsing as JSON (rich text)
		const contentState = convertFromRaw(JSON.parse(value));
		return EditorState.createWithContent(contentState);
	} catch (e) {
		// Fallback to plain text
		console.warn("Creating editor state from plain text", e);
		const contentState = ContentState.createFromText(String(value || ""));
		return EditorState.createWithContent(contentState);
	}
};

export const convertEditorStateToRaw = (editorState) => {
	if (!editorState) return "";

	const contentState = editorState.getCurrentContent();
	const rawContent = convertToRaw(contentState);
	return JSON.stringify(rawContent);
};

export const getPlainText = (value) => {
	if (!value) return "";

	try {
		const contentState = convertFromRaw(JSON.parse(value));
		return contentState.getPlainText();
	} catch (e) {
		return String(value || "");
	}
};

export const isEmptyEditorState = (editorState) => {
	if (!editorState) return true;

	const contentState = editorState.getCurrentContent();
	return !contentState.hasText() && contentState.getBlockMap().first().getType() === "unstyled";
};
