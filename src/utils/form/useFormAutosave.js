import { useEffect, useRef } from "react";
import { isEqual } from "../objectUtils";

export function useFormAutosave({ formData, onSave, delay = 2000 }) {
	const previousDataRef = useRef(formData);
	const timeoutRef = useRef(null);

	useEffect(() => {
		// Only trigger save if data has actually changed
		if (!isEqual(formData, previousDataRef.current)) {
			// Clear any pending save
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			// Set new timeout for debounced save
			timeoutRef.current = setTimeout(async () => {
				try {
					await onSave?.(formData);
					previousDataRef.current = formData;
				} catch (err) {
					console.error("Autosave error:", err);
				}
			}, delay);
		}

		// Cleanup
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [formData, onSave, delay]);
}
