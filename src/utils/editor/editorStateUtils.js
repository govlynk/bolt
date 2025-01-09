import { EditorState, convertToRaw, convertFromRaw, ContentState } from "draft-js";

export const createEditorStateFromRaw = (value, previousEditorState = null) => {
	if (!value) {
		return EditorState.createEmpty();
	}

	try {
		// If value is already a string, try parsing it as JSON
		if (typeof value === "string") {
			// Try parsing as JSON (rich text)
			const contentState = convertFromRaw(JSON.parse(value));
			const newEditorState = EditorState.createWithContent(contentState);

			// If we have a previous editor state, try to preserve selection
			if (previousEditorState) {
				const selection = previousEditorState.getSelection();
				if (selection.getHasFocus()) {
					return EditorState.forceSelection(newEditorState, selection);
				}
			}

			return newEditorState;
		}

		// If value is already an object, assume it's raw content state
		if (typeof value === "object") {
			const contentState = convertFromRaw(value);
			return EditorState.createWithContent(contentState);
		}

		// Fallback to creating empty state
		console.warn("Invalid editor content, creating empty state");
		return EditorState.createEmpty();
	} catch (e) {
		// If parsing fails, create content from plain text
		console.warn("Creating editor state from plain text:", e);
		const contentState = ContentState.createFromText(String(value || ""));
		return EditorState.createWithContent(contentState);
	}
};

export const convertEditorStateToRaw = (editorState) => {
	if (!editorState) return "";

	try {
		const contentState = editorState.getCurrentContent();
		const rawContent = convertToRaw(contentState);
		return JSON.stringify(rawContent);
	} catch (e) {
		console.error("Error converting editor state to raw:", e);
		return "";
	}
};

export const getPlainText = (value) => {
	if (!value) return "";

	try {
		// If value is a string, try parsing as JSON first
		if (typeof value === "string") {
			const contentState = convertFromRaw(JSON.parse(value));
			return contentState.getPlainText();
		}

		// If value is an object, assume it's raw content state
		if (typeof value === "object") {
			const contentState = convertFromRaw(value);
			return contentState.getPlainText();
		}

		return String(value || "");
	} catch (e) {
		return String(value || "");
	}
};

export const isEmptyEditorState = (editorState) => {
	if (!editorState) return true;

	const contentState = editorState.getCurrentContent();
	return !contentState.hasText() && contentState.getBlockMap().first().getType() === "unstyled";
};

export const validateEditorContent = (value) => {
	try {
		if (typeof value === "string") {
			JSON.parse(value);
		}
		return true;
	} catch (e) {
		return false;
	}
};
