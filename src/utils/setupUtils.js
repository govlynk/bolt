// Setup data validation and initialization utilities
export function initializeCompanyData(formattedData) {
	console.log("company data", formattedData);
	return {
		legalBusinessName: formattedData.legalBusinessName.trim(),
		dbaName: formattedData.dbaName?.trim() || null,
		uei: formattedData.uei.trim(),
		cageCode: formattedData.cageCode || null,
		ein: formattedData.ein || null,
		status: "ACTIVE",

		activationDate: formattedData.activationDate ? new Date(formattedData.activationDate).toISOString() : null,
		shippingAddressStreetLine1: formattedData.shippingAddressStreetLine1 || null,
		shippingAddressStreetLine2: formattedData.shippingAddressStreetLine2 || null,
		shippingAddressCity: formattedData.shippingAddressCity || null,
		shippingAddressStateCode: formattedData.shippingAddressStateCode || null,
		shippingAddressZipCode: formattedData.shippingAddressZipCode || null,
		shippingAddressCountryCode: formattedData.shippingAddressCountryCode || null,
		billingAddressCity: formattedData.billingAddressCity || null,
		billingAddressCountryCode: formattedData.billingAddressCountryCode || null,
		billingAddressStateCode: formattedData.billingAddressStateCode || null,
		billingAddressStreetLine1: formattedData.billingAddressStreetLine1 || null,
		billingAddressStreetLine2: formattedData.billingAddressStreetLine2 || null,
		billingAddressZipCode: formattedData.billingAddressZipCode || null,

		companyStartDate: formattedData.companyStartDate ? new Date(formattedData.companyStartDate).toISOString() : null,
		congressionalDistrict: formattedData.congressionalDistrict || null,
		countryOfIncorporationCode: formattedData.countryOfIncorporationCode || null,
		disasterRegistryFlag: formattedData.disasterRegistryFlag || null,
		entityDivisionName: formattedData.entityDivisionName || null,
		entityStartDate: formattedData.entityStartDate ? new Date(formattedData.entityStartDate).toISOString() : null,
		entityStructureDesc: formattedData.entityStructureDesc || null,
		entityTypeDesc: formattedData.entityTypeDesc || null,
		exclusionStatusFlag: formattedData.exclusionStatusFlag || null,
		fiscalYearEndCloseDate: formattedData.fiscalYearEndCloseDate
			? new Date(formattedData.fiscalYearEndCloseDate).toISOString()
			: null,
		lastUpdateDate: formattedData.lastUpdateDate ? new Date(formattedData.lastUpdateDate).toISOString() : null,

		companyEmail: formattedData.companyEmail || null,
		companyPhoneNumber: formattedData.companyPhoneNumber || null,
		companyWebsite: formattedData.companyWebsite || null,
		organizationStructureDesc: formattedData.organizationStructureDesc || null,
		profitStructureDesc: formattedData.profitStructureDesc || null,
		//
		registrationDate: formattedData.registrationDate ? new Date(formattedData.registrationDate).toISOString() : null,
		//
		registrationExpirationDate: formattedData.registrationExpirationDate
			? new Date(formattedData.registrationExpirationDate).toISOString()
			: null,

		registrationStatus: formattedData.registrationStatus || null,
		purposeOfRegistrationDesc: formattedData.purposeOfRegistrationDesc || null,
		stateOfIncorporationCode: formattedData.stateOfIncorporationCode || null,
		businessTypeDesc: formattedData.businessTypeDesc || [],
		sbaBusinessTypeDesc: formattedData.sbaBusinessTypeDesc || [],
		sbaCertificationEntryDate: formattedData.sbaCertificationEntryDate
			? new Date(formattedData.sbaCertificationEntryDate).toISOString()
			: null,
		sbaCertificationExitDate: formattedData.sbaCertificationExitDate
			? new Date(formattedData.sbaCertificationExitDate).toISOString()
			: null,
		submissionDate: formattedData.submissionDate ? new Date(formattedData.submissionDate).toISOString() : null,
		SAMPullDate: new Date().toISOString(),

		naicsCode: formattedData.naicsCode || [],
		naicsDescription: formattedData.naicsDescription || [],
		pscCode: formattedData.pscCode || [],
		pscDescription: formattedData.pscDescription || [],
		primaryNaics: formattedData.primaryNaics || null,
	};
}

export function initializeContactData(contact) {
	console.log("contact data", contact);
	return {
		firstName: contact.firstName,
		lastName: contact.lastName,
		title: contact.title || null,
		department: contact.department || null,
		contactEmail: contact.contactEmail,
		contactMobilePhone: contact.contactMobilePhone || null,
		contactBusinessPhone: contact.contactBusinessPhone || null,
		workAddressStreetLine1: contact.workAddressStreetLine1 || null,
		workAddressStreetLine2: contact.workAddressStreetLine2 || null,
		workAddressCity: contact.workAddressCity || null,
		workAddressStateCode: contact.workAddressStateCode || null,
		workAddressZipCode: contact.workAddressZipCode || null,
		workAddressCountryCode: contact.workAddressCountryCode || "USA",
		dateLastContacted: new Date().toISOString(),
		emailOptOut: false,
		notes: `Initial contact created during company setup. Role: ${contact.roleId}`,
		companyId: contact.companyId,
		documentFolder: null,
		resume: null,
	};
}

export function initializeUserData(userData) {
	console.log("user data", userData);
	return {
		cognitoId: userData.cognitoId || null,
		email: userData.email,
		name: `${userData.firstName} ${userData.lastName}`,
		phone: userData.contactBusinessPhone || userData.contactMobilePhone || null,
		status: "ACTIVE",
		avatar: null,
		contactId: userData.contactId,
		lastLogin: new Date().toISOString(),
	};
}

export function initializeTeamData(teamData, companyId) {
	console.log("team data", teamData);
	return {
		...teamData,
		companyId,
	};
}

export function initializeTeamMemberData(contactId, teamId, role) {
	console.log("team member data", contactId, teamId, role);
	return {
		contactId,
		teamId,
		role: role || "Other",
	};
}

export function initializeUserCompanyAccess(userId, companyId, access) {
	console.log("user company access", userId, companyId, access);
	return {
		userId,
		companyId,
		access,
	};
}
