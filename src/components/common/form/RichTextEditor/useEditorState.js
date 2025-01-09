import { useState, useEffect, useRef } from "react";
import { EditorState, convertToRaw, convertFromRaw, ContentState } from "draft-js";

export function useEditorState({ value, onChange, readOnly }) {
	// Store selection state
	const selectionRef = useRef(null);

	const [editorState, setEditorState] = useState(() => {
		try {
			if (!value) {
				return EditorState.createEmpty();
			}

			// Handle string value (JSON)
			if (typeof value === "string") {
				const content = JSON.parse(value);
				return EditorState.createWithContent(convertFromRaw(content));
			}

			// Handle raw content state
			if (typeof value === "object") {
				return EditorState.createWithContent(convertFromRaw(value));
			}

			return EditorState.createEmpty();
		} catch (err) {
			console.warn("Error creating editor state:", err);
			return EditorState.createEmpty();
		}
	});

	const prevValueRef = useRef(value);

	// Update editor state when value prop changes
	useEffect(() => {
		if (value !== prevValueRef.current) {
			prevValueRef.current = value;
			try {
				if (!value) {
					setEditorState(EditorState.createEmpty());
					return;
				}

				const content = typeof value === "string" ? JSON.parse(value) : value;
				const newState = EditorState.createWithContent(convertFromRaw(content));

				// Restore selection if available
				if (selectionRef.current) {
					const stateWithSelection = EditorState.forceSelection(newState, selectionRef.current);
					setEditorState(stateWithSelection);
				} else {
					setEditorState(newState);
				}
			} catch (err) {
				console.warn("Error updating editor state:", err);
			}
		}
	}, [value]);

	// Handle editor state changes
	const handleEditorStateChange = (newState) => {
		if (!newState) return;

		// Store selection state
		selectionRef.current = newState.getSelection();

		setEditorState(newState);

		if (!readOnly && onChange) {
			try {
				const content = convertToRaw(newState.getCurrentContent());
				const rawContent = JSON.stringify(content);
				if (rawContent !== value) {
					onChange(rawContent);
				}
			} catch (err) {
				console.error("Error converting editor content:", err);
			}
		}
	};

	return {
		editorState,
		setEditorState: handleEditorStateChange,
	};
}
