import React, { useCallback } from "react";
import { Editor, RichUtils, EditorState } from "draft-js";
import { Box, Paper } from "@mui/material";
import { EditorToolbar } from "./EditorToolbar";
import { useEditorState } from "./useEditorState";
import "draft-js/dist/Draft.css";

export function RichTextEditor({ value, onChange, placeholder, minHeight = 200, readOnly = false, error = false }) {
	const { editorState, setEditorState } = useEditorState({
		value,
		onChange,
		readOnly,
	});

	const handleKeyCommand = useCallback(
		(command, editorState) => {
			const newState = RichUtils.handleKeyCommand(editorState, command);
			if (newState) {
				setEditorState(newState);
				return "handled";
			}
			return "not-handled";
		},
		[setEditorState]
	);

	const handleToolbarToggle = useCallback(
		(type, newState) => {
			if (!newState) return;
			setEditorState(newState);
		},
		[setEditorState]
	);

	const handleFocus = useCallback(() => {
		if (!readOnly && editorState) {
			const selection = editorState.getSelection();
			const content = editorState.getCurrentContent();
			const blockMap = content.getBlockMap();
			const key = selection.getStartKey();
			const offset = selection.getStartOffset();

			const newSelection = selection.merge({
				anchorKey: key,
				anchorOffset: offset,
				focusKey: key,
				focusOffset: offset,
				hasFocus: true,
			});

			const newEditorState = EditorState.forceSelection(editorState, newSelection);
			setEditorState(newEditorState);
		}
	}, [editorState, readOnly, setEditorState]);

	// Return null if no valid editorState
	if (!editorState) return null;

	return (
		<Paper
			variant='outlined'
			sx={{
				border: error ? "1px solid red" : undefined,
				"&:hover": {
					borderColor: error ? "red" : "primary.main",
				},
			}}
		>
			{!readOnly && <EditorToolbar editorState={editorState} onToggle={handleToolbarToggle} />}
			<Box
				sx={{
					minHeight,
					padding: 2,
					cursor: readOnly ? "default" : "text",
					"& .DraftEditor-root": {
						height: "100%",
					},
					"& .public-DraftEditorPlaceholder-root": {
						color: "text.secondary",
						position: "absolute",
						padding: "8px",
					},
					"& .public-DraftEditor-content": {
						minHeight: minHeight - 32,
					},
				}}
				onClick={handleFocus}
			>
				<Editor
					editorState={editorState}
					onChange={setEditorState}
					placeholder={placeholder}
					readOnly={readOnly}
					handleKeyCommand={handleKeyCommand}
					spellCheck={true}
					preserveSelectionOnBlur={true}
				/>
			</Box>
		</Paper>
	);
}
