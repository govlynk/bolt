import { QUESTION_TYPES } from "./questionTypes";

export const questions = [
	// Yes/No Questions
	{
		id: "registration",
		title: "SAM.gov Registration",
		description: "Is your entity registration active in SAM.gov?",
		type: QUESTION_TYPES.YES_NO,
		options: ["Yes", "No"],
		required: true,
	},
	{
		id: "security",
		title: "Security Clearances",
		description: "Do you have required facility or personnel security clearances?",
		type: QUESTION_TYPES.YES_NO,
		options: ["Yes", "No"],
		required: true,
	},

	// Multiple Choice Questions
	{
		id: "businessSize",
		title: "Business Size",
		description: "What is your business size classification?",
		type: QUESTION_TYPES.MULTIPLE_CHOICE,
		options: ["Small Business", "Large Business", "Not Sure"],
		required: true,
	},
	{
		id: "socioeconomic",
		title: "Socioeconomic Status",
		description: "Select all socioeconomic categories that apply:",
		type: QUESTION_TYPES.MULTIPLE_CHOICE,
		options: ["8(a)", "WOSB", "HUBZone", "SDVOSB", "None"],
		multiple: true,
		required: true,
	},

	// Text Response Questions
	{
		id: "capabilities",
		title: "Core Capabilities",
		description: "Describe your company's core capabilities and differentiators (max 500 characters)",
		type: QUESTION_TYPES.TEXT,
		maxLength: 500,
		required: true,
	},
	{
		id: "pastPerformance",
		title: "Past Performance",
		description: "Describe your most relevant past performance example",
		type: QUESTION_TYPES.TEXT,
		maxLength: 1000,
		required: true,
	},

	// Code List Questions
	{
		id: "primaryNaics",
		title: "Primary NAICS Code",
		description: "Enter your primary NAICS code",
		type: QUESTION_TYPES.CODE_LIST,
		// validation: /^\d{6}$/,
		required: true,
	},
	{
		id: "secondaryNaics",
		title: "Secondary NAICS Codes",
		description: "Enter up to 5 secondary NAICS codes (comma separated)",
		type: QUESTION_TYPES.CODE_LIST,
		validation: /^(\d{6},?\s*){1,5}$/,
		required: false,
	},

	// Multiple Choice with Status
	{
		id: "contractVehicles",
		title: "Contract Vehicles",
		description: "What is the status of your contract vehicles?",
		type: QUESTION_TYPES.MULTIPLE_CHOICE,
		options: ["Have GSA Schedule", "Have GWACs", "In Process", "None", "Need Assistance"],
		multiple: true,
		required: true,
	},
	{
		id: "complianceSystems",
		title: "Compliance Systems",
		description: "Which compliance systems do you have in place?",
		type: QUESTION_TYPES.MULTIPLE_CHOICE,
		options: ["Accounting System", "Quality Control", "Project Management", "Cybersecurity", "None"],
		multiple: true,
		required: true,
	},
];
