import React, { useState, useEffect } from "react";
import { Box, Stepper, Step, StepLabel, Button, Alert } from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { InfoSidebar } from "./InfoSidebar";

export function FormController({
  steps,
  initialData = {},
  onSubmit,
  onSave,
  questionInfo,
  loading = false,
  error = null,
  StepperComponent,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleNext = () => {
    const currentStep = steps[activeStep];
    if (currentStep.validate) {
      const errors = currentStep.validate(formData);
      if (errors) {
        setValidationErrors(errors);
        return;
      }
    }
    setValidationErrors({});
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSave = async () => {
    try {
      await onSave?.(formData);
    } catch (err) {
      console.error("Error saving form:", err);
    }
  };

  const handleSubmit = async () => {
    // Validate all steps before submission
    for (const step of steps) {
      if (step.validate) {
        const errors = step.validate(formData);
        if (errors) {
          setValidationErrors(errors);
          return;
        }
      }
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation errors for the changed field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const currentStep = steps[activeStep];
  const StepComponent = currentStep?.component;

  return (
    <Box sx={{ mx: "auto", p: 3 }}>
      {StepperComponent ? (
        <StepperComponent
          steps={steps}
          activeStep={activeStep}
          onStepClick={setActiveStep}
        />
      ) : (
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        {StepComponent && (
          <StepComponent
            formData={formData}
            onChange={handleChange}
            errors={validationErrors}
            onInfoClick={() => setSidebarOpen(true)}
          />
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button 
          onClick={handleBack} 
          disabled={activeStep === 0 || loading} 
          startIcon={<ArrowLeft />}
        >
          Back
        </Button>

        <Box sx={{ display: "flex", gap: 2 }}>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={<ArrowRight />}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit
            </Button>
          )}
        </Box>
      </Box>

      <InfoSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        questionInfo={questionInfo?.[currentStep?.id]}
      />
    </Box>
  );
}