import React from "react";
import { Box, IconButton, Tooltip, Divider } from "@mui/material";
import { RichUtils, EditorState } from "draft-js";
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Heading1,
	Heading2,
	Quote,
} from "lucide-react";

const INLINE_STYLES = [
	{ label: "Bold", style: "BOLD", icon: Bold },
	{ label: "Italic", style: "ITALIC", icon: Italic },
];

const BLOCK_TYPES = [
	{ label: "H1", style: "header-one", icon: Heading1 },
	{ label: "H2", style: "header-two", icon: Heading2 },
	{ label: "Blockquote", style: "blockquote", icon: Quote },
	{ label: "UL", style: "unordered-list-item", icon: List },
	{ label: "OL", style: "ordered-list-item", icon: ListOrdered },
];

const ALIGNMENT_STYLES = [
	{ label: "Left", style: "left", icon: AlignLeft },
	{ label: "Center", style: "center", icon: AlignCenter },
	{ label: "Right", style: "right", icon: AlignRight },
];

export function EditorToolbar({ editorState, onToggle }) {
	// Guard against undefined editorState
	if (!editorState || !(editorState instanceof EditorState)) {
		return null;
	}

	const currentContent = editorState.getCurrentContent();
	if (!currentContent) return null;

	const currentInlineStyle = editorState.getCurrentInlineStyle();
	const selection = editorState.getSelection();
	const blockType = currentContent.getBlockForKey(selection.getStartKey())?.getType() || "unstyled";

	const toggleInlineStyle = (style) => {
		onToggle("inline", RichUtils.toggleInlineStyle(editorState, style));
	};

	const toggleBlockType = (type) => {
		onToggle("block", RichUtils.toggleBlockType(editorState, type));
	};

	const toggleAlignment = (alignment) => {
		onToggle("alignment", alignment);
	};

	return (
		<Box
			sx={{
				display: "flex",
				gap: 0.5,
				p: 1,
				borderBottom: 1,
				borderColor: "divider",
				flexWrap: "wrap",
			}}
		>
			{INLINE_STYLES.map(({ label, style, icon: Icon }) => (
				<Tooltip key={style} title={label}>
					<IconButton
						size='small'
						onClick={() => toggleInlineStyle(style)}
						color={currentInlineStyle.has(style) ? "primary" : "default"}
					>
						<Icon size={18} />
					</IconButton>
				</Tooltip>
			))}

			<Divider orientation='vertical' flexItem />

			{BLOCK_TYPES.map(({ label, style, icon: Icon }) => (
				<Tooltip key={style} title={label}>
					<IconButton
						size='small'
						onClick={() => toggleBlockType(style)}
						color={blockType === style ? "primary" : "default"}
					>
						<Icon size={18} />
					</IconButton>
				</Tooltip>
			))}

			<Divider orientation='vertical' flexItem />

			{ALIGNMENT_STYLES.map(({ label, style, icon: Icon }) => (
				<Tooltip key={style} title={label}>
					<IconButton
						size='small'
						onClick={() => toggleAlignment(style)}
						color={blockType === `text-align-${style}` ? "primary" : "default"}
					>
						<Icon size={18} />
					</IconButton>
				</Tooltip>
			))}
		</Box>
	);
}
