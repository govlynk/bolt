import { convertToRaw, convertFromRaw, ContentState } from 'draft-js';

export const convertToEditorContent = (value) => {
  if (!value) return null;
  
  try {
    return convertFromRaw(JSON.parse(value));
  } catch (e) {
    console.warn('Invalid editor content:', e);
    return null;
  }
};

export const convertFromEditorContent = (contentState) => {
  if (!contentState) return '';
  
  try {
    return JSON.stringify(convertToRaw(contentState));
  } catch (e) {
    console.warn('Error converting editor content:', e);
    return '';
  }
};

export const getPlainText = (rawContent) => {
  if (!rawContent) return '';
  
  try {
    const contentState = convertFromRaw(JSON.parse(rawContent));
    return contentState.getPlainText();
  } catch (e) {
    console.warn('Error converting to plain text:', e);
    return '';
  }
};

export const validateEditorContent = (value, { required, minLength, maxLength } = {}) => {
  if (!value && required) {
    return 'This field is required';
  }

  const plainText = getPlainText(value);

  if (minLength && plainText.length < minLength) {
    return `Must be at least ${minLength} characters`;
  }

  if (maxLength && plainText.length > maxLength) {
    return `Must be no more than ${maxLength} characters`;
  }

  return null;
};