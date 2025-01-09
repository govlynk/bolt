import React, { useEffect } from "react";
import { Box, Alert } from "@mui/material";
import { FormController } from "../common/form/FormController";
import { useStrategicPositioningStore } from "../../stores/strategicPositioningStore";
import { useGlobalStore } from "../../stores/globalStore";
import { StepperProgress } from "../common/form/StepperProgress";
import { QuestionCard } from "../common/form/QuestionCard";
import { RichTextQuestion } from "../common/form/questionTypes/RichTextQuestion";
import { SortableListQuestion } from "../common/form/questionTypes/SortableListQuestion";
import { questions } from "./questions";
import { questionInfo } from "./questionInfo";

const QUESTION_COMPONENTS = {
	richText: RichTextQuestion,
	sortableList: SortableListQuestion,
};

export default function StrategicPositioningForm() {
	const { activeCompanyId } = useGlobalStore();
	const {
		capabilityStatement,
		loading,
		error,
		success,
		fetchCapabilityStatement,
		saveCapabilityStatement,
		resetSuccess,
	} = useStrategicPositioningStore();

	// Fetch initial data when component mounts
	useEffect(() => {
		if (activeCompanyId) {
			fetchCapabilityStatement(activeCompanyId);
		}
	}, [activeCompanyId, fetchCapabilityStatement]);

	const formSteps = questions.map((question) => ({
		id: question.id,
		title: question.title,
		component: ({ formData, onChange, errors, onInfoClick }) => {
			const QuestionComponent = QUESTION_COMPONENTS[question.type];
			if (!QuestionComponent) {
				console.error(`No component found for question type: ${question.type}`);
				return null;
			}

			return (
				<QuestionCard title={question.title} subtitle={question.instructions}>
					<QuestionComponent
						question={question}
						value={formData[question.id]}
						onChange={(value) => onChange(question.id, value)}
						error={errors?.[question.id]}
						onInfoClick={onInfoClick}
					/>
				</QuestionCard>
			);
		},
		validate: (data) => {
			if (question.required && !data[question.id]) {
				return { [question.id]: "This field is required" };
			}
			return null;
		},
	}));

	const handleSubmit = async (formData) => {
		if (!activeCompanyId) return;

		try {
			await saveCapabilityStatement({
				...formData,
				companyId: activeCompanyId,
			});
		} catch (err) {
			console.error("Error submitting form:", err);
			throw err;
		}
	};

	return (
		<Box>
			{success && (
				<Alert severity='success' onClose={resetSuccess} sx={{ mb: 3 }}>
					Strategic positioning statement saved successfully!
				</Alert>
			)}

			<FormController
				steps={formSteps}
				initialData={capabilityStatement || {}}
				onSubmit={handleSubmit}
				loading={loading}
				error={error}
				questionInfo={questionInfo}
				StepperComponent={StepperProgress}
				onSuccess={() => {
					// Reset to first step after successful save
					return { resetStep: true };
				}}
			/>
		</Box>
	);
}
