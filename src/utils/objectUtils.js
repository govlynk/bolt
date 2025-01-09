/**
 * Deep equality comparison for objects
 */
export function isEqual(obj1, obj2) {
	// Handle null/undefined
	if (obj1 === obj2) return true;
	if (!obj1 || !obj2) return false;

	// Handle different types
	if (typeof obj1 !== typeof obj2) return false;

	// Handle arrays
	if (Array.isArray(obj1) && Array.isArray(obj2)) {
		if (obj1.length !== obj2.length) return false;
		return obj1.every((item, index) => isEqual(item, obj2[index]));
	}

	// Handle objects
	if (typeof obj1 === "object") {
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) return false;

		return keys1.every((key) => obj2.hasOwnProperty(key) && isEqual(obj1[key], obj2[key]));
	}

	// Handle primitives
	return obj1 === obj2;
}
