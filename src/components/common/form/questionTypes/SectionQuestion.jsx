import React from "react";
import { getNormalizedQuestionType } from "../questionTypes";
import { Box, Typography, Paper, Divider, IconButton } from "@mui/material";
import { Info } from "lucide-react";

// Import all question components
import { TextQuestion } from "./TextQuestion";
import { RatingQuestion } from "./RatingQuestion";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { RichTextQuestion } from "./RichTextQuestion";
import { AuthorizationQuestion } from "./AuthorizationQuestion";
import { LikertQuestion } from "./LikertQuestion";
import { CodeListQuestion } from "./CodeListQuestion";
import { DemographicQuestion } from "./DemographicQuestion";

// Map question types to components
const questionComponents = {
	text: TextQuestion,
	longText: TextQuestion,
	richText: RichTextQuestion,
	rating: RatingQuestion,
	multipleChoice: MultipleChoiceQuestion,
	singleChoice: MultipleChoiceQuestion,
	likert: LikertQuestion,
	codeList: CodeListQuestion,
	demographic: DemographicQuestion,
	authorization: AuthorizationQuestion,
};

export function SectionQuestion({ question, value = {}, onChange, error = {}, onInfoClick }) {
	const handleQuestionChange = (questionId, questionValue) => {
		onChange({
			...value,
			[questionId]: questionValue,
		});
	};

	return (
		<Box sx={{ mb: 4 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
				<Typography variant='h5' gutterBottom>
					{question.title}
				</Typography>
				{onInfoClick && (
					<IconButton size='small' onClick={() => onInfoClick(question)}>
						<Info size={20} />
					</IconButton>
				)}
			</Box>
			{question.description && (
				<Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
					{question.description}
				</Typography>
			)}

			<Paper variant='outlined' sx={{ p: 3 }}>
				{question.questions.map((subQuestion, index) => {
					const type = getNormalizedQuestionType(subQuestion.type);
					const QuestionComponent = questionComponents[type];

					if (!QuestionComponent) {
						console.error(`Unknown question type: ${subQuestion.type} (normalized: ${type})`);
						return null;
					}

					return (
						<Box key={subQuestion.id}>
							<QuestionComponent
								question={subQuestion}
								value={value[subQuestion.id]}
								onChange={(newValue) => handleQuestionChange(subQuestion.id, newValue)}
								error={error[subQuestion.id]}
								onInfoClick={onInfoClick}
							/>
							{index < question.questions.length - 1 && <Divider sx={{ my: 3 }} />}
						</Box>
					);
				})}
			</Paper>
		</Box>
	);
}
