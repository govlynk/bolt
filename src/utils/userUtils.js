import { generateClient } from "aws-amplify/data";

const client = generateClient();

export async function createOrUpdateUser(userData) {
	// Check if user exists
	const existingUsers = await client.models.User.list({
		filter: { email: { eq: userData.email } },
	});

	let user;
	if (existingUsers.data?.length > 0) {
		// Update existing user
		const updateResponse = await client.models.User.update({
			id: existingUsers.data[0].id,
			name: userData.name,
			phone: userData.phone,
			status: userData.status,
			contactId: userData.contactId,
			lastLogin: new Date().toISOString(),
		});
		user = updateResponse.data;
	} else {
		// Create new user
		const createResponse = await client.models.User.create({
			cognitoId: userData.cognitoId,
			email: userData.email,
			name: userData.name,
			phone: userData.phone,
			status: userData.status,
			contactId: userData.contactId,
			lastLogin: new Date().toISOString(),
		});
		user = createResponse.data;
	}

	return user;
}

export async function createOrUpdateUserCompanyAccess(userId, companyId, accessLevel) {
	// Check for existing access
	const existingAccess = await client.models.UserCompanyAccess.list({
		filter: {
			and: [{ userId: { eq: userId } }, { companyId: { eq: companyId } }],
		},
	});
	console.log("existing", userId, companyId, accessLevel, existingAccess);

	if (existingAccess.data?.length > 0) {
		// Update existing access
		return client.models.UserCompanyAccess.update({
			id: existingAccess.data[0].id,
			access: accessLevel,
			status: "ACTIVE",
		});
	}

	// Create new access
	return client.models.UserCompanyAccess.create({
		userId,
		companyId,
		access: accessLevel,
		status: "ACTIVE",
	});
}
