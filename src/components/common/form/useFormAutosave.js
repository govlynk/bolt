import { useEffect, useRef } from "react";
import { debounce } from "../../../utils/debounce";

export function useFormAutosave({ formData, onSave, delay = 2000 }) {
	const saveRef = useRef(null);

	useEffect(() => {
		if (!onSave) return;

		if (!saveRef.current) {
			saveRef.current = debounce(async (data) => {
				try {
					await onSave(data);
				} catch (err) {
					console.error("Autosave error:", err);
				}
			}, delay);
		}

		saveRef.current(formData);

		return () => {
			if (saveRef.current?.cancel) {
				saveRef.current.cancel();
			}
		};
	}, [formData, onSave, delay]);
}
