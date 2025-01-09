/**
 * Contact validation and filtering utilities
 */

// Email validation
export function hasValidEmail(contact) {
  return Boolean(contact.email || contact.contactEmail);
}

// Contact list filtering
export function filterContactsWithEmail(contacts) {
  return contacts.filter(hasValidEmail);
}

// Contact validation
export function validateContact(contact) {
  if (!contact.firstName?.trim()) {
    return "First name is required";
  }
  if (!contact.lastName?.trim()) {
    return "Last name is required";
  }
  if (!hasValidEmail(contact)) {
    return "Email address is required";
  }
  return null;
}

// Initialize contacts from company data
export function initializeContacts(companyData) {
  const initialContacts = [];

  // Add Electronic Business POC if available
  if (companyData.EBfirstName) {
    initialContacts.push({
      id: "EB",
      firstName: companyData.EBfirstName,
      lastName: companyData.EBlastName,
      email: companyData.EBemail,
      phone: companyData.EBphone,
      dateLastContacted: new Date().toISOString(),
      role: "Executive",
      notes: "Initial contact created during company setup. Role: Electronic Business POC",
      // Additional address fields
      workAddressStreetLine1: companyData.EBaddressLine1 || "",
      workAddressStreetLine2: companyData.EBaddressLine2 || "",
      workAddressCity: companyData.EBcity || "",
      workAddressStateCode: companyData.EBstateOrProvinceCode || "",
      workAddressZipCode: companyData.EBzipCode || "",
      workAddressCountryCode: companyData.EBcountryCode || "",
    });
  }

  // Add Government Business POC if available
  if (companyData.GBfirstName) {
    initialContacts.push({
      id: "GB",
      firstName: companyData.GBfirstName,
      lastName: companyData.GBlastName,
      email: companyData.GBemail,
      phone: companyData.GBphone,
      dateLastContacted: new Date().toISOString(),
      role: "Executive",
      notes: "Initial contact created during company setup. Role: Government Business POC",
      // Additional address fields
      workAddressStreetLine1: companyData.GBaddressLine1 || "",
      workAddressStreetLine2: companyData.GBaddressLine2 || "",
      workAddressCity: companyData.GBcity || "",
      workAddressStateCode: companyData.GBstateOrProvinceCode || "",
      workAddressZipCode: companyData.GBzipCode || "",
      workAddressCountryCode: companyData.GBcountryCode || "",
    });
  }

  return initialContacts;
}

// Contact data normalization
export function normalizeContactData(contact) {
  return {
    ...contact,
    email: contact.email || contact.contactEmail || "",
    phone: contact.phone || contact.contactMobilePhone || contact.contactBusinessPhone || "",
    firstName: contact.firstName?.trim() || "",
    lastName: contact.lastName?.trim() || "",
    role: contact.role || "",
    notes: contact.notes?.trim() || "",
  };
}

// Contact list operations
export function updateContact(contacts, updatedContact) {
  return contacts.map(contact => 
    contact.id === updatedContact.id ? normalizeContactData(updatedContact) : contact
  );
}

export function addContact(contacts, newContact) {
  return [...contacts, normalizeContactData({ ...newContact, id: Date.now().toString() })];
}

export function removeContact(contacts, contactId) {
  return contacts.filter(contact => contact.id !== contactId);
}