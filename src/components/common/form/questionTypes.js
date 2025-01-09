// Define all possible question types
export const QUESTION_TYPES = {
	TEXT: "text",
	LONG_TEXT: "longText",
	RICH_TEXT: "richText",
	YES_NO: "yesNo",
	MULTIPLE_CHOICE: "multipleChoice",
	SINGLE_CHOICE: "singleChoice",
	RATING: "rating",
	DROPDOWN: "dropdown",
	LIKERT: "likert",
	SLIDER: "slider",
	DEMOGRAPHIC: "demographic",
	FILE_UPLOAD: "fileUpload",
	SECTION: "section",
	AUTHORIZATION: "authorization",
	CODE_LIST: "codeList",
};

// Map for normalizing question types to component keys
export const QUESTION_TYPE_MAP = {
	// Direct mappings
	text: "text",
	longtext: "longText",
	richtext: "richText",
	yesno: "yesNo",
	multiplechoice: "multipleChoice",
	singlechoice: "singleChoice",
	rating: "rating",
	dropdown: "dropdown",
	likert: "likert",
	slider: "slider",
	demographic: "demographic",
	fileupload: "fileUpload",
	section: "section",
	authorization: "authorization",
	codelist: "codeList",

	// Handle case variations
	multiple_choice: "multipleChoice",
	single_choice: "singleChoice",
	rich_text: "richText",

	// Map enum values
	[QUESTION_TYPES.MULTIPLE_CHOICE]: "multipleChoice",
	[QUESTION_TYPES.SINGLE_CHOICE]: "singleChoice",
	[QUESTION_TYPES.RICH_TEXT]: "richText",
	[QUESTION_TYPES.DEMOGRAPHIC]: "demographic",
};

// Helper function to get normalized question type
export const getNormalizedQuestionType = (type) => {
	if (!type) return null;

	// Convert to lowercase and remove spaces/underscores for consistent lookup
	const lookupKey = typeof type === "string" ? type.toLowerCase().replace(/[_\s]/g, "") : type;

	const normalized = QUESTION_TYPE_MAP[lookupKey];

	if (!normalized) {
		console.warn(`Unknown question type: ${type} (normalized: ${lookupKey})`);
	}

	return normalized || lookupKey;
};
