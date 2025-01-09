import { generateClient } from "aws-amplify/data";
import { initializeCompanyData, initializeContactData, initializeTeamData } from "./setupUtils";

const client = generateClient({
	authMode: "userPool",
});

export async function setupCompany({ companyData, contactsData, adminData, teamData }) {
	try {
		// 1. Create company
		const company = await createCompany(companyData);
		console.log("Created company:", company);

		// 2. Create contacts
		const contacts = await createContacts(contactsData, company.id);
		console.log("Created contacts:", contacts);

		// 3. Create team
		const team = await createTeam(teamData, company.id);
		console.log("Created team:", team);

		// 4. Create admin users and their associations
		const adminUsers = await Promise.all(
			adminData.map(async (admin) => {
				console.log("+++++++admin++++++", admin);

				// Find matching contact
				const contact = contacts.find((c) => c.contactEmail === admin.email || c.email === admin.email);

				if (!contact) {
					throw new Error(`No matching contact found for admin email: ${admin.email}`);
				}

				// Check if user already exists with this email
				const existingUsers = await client.models.User.list({
					filter: { email: { eq: admin.email } },
				});

				let user;
				if (existingUsers.data?.length > 0) {
					// Update existing user
					user = existingUsers.data[0];
					await client.models.User.update({
						id: user.id,
						contactId: contact.id,
						lastLogin: new Date().toISOString(),
					});
				} else {
					// Create new user
					const userResponse = await client.models.User.create({
						cognitoId: admin.cognitoId,
						email: admin.email,
						name: `${admin.firstName} ${admin.lastName}`,
						phone: admin.phone,
						contactId: contact.id,
						status: "ACTIVE",
						lastLogin: new Date().toISOString(),
					});
					user = userResponse.data;
				}

				// Create or update user-company access
				const existingAccess = await client.models.UserCompanyAccess.list({
					filter: {
						and: [{ userId: { eq: user.id } }, { companyId: { eq: company.id } }],
					},
				});

				if (!existingAccess.data?.length) {
					await client.models.UserCompanyAccess.create({
						userId: user.id,
						companyId: company.id,
						access: admin.accessLevel,
						status: "ACTIVE",
					});
				}

				// Create team member if not exists
				const existingMember = await client.models.TeamMember.list({
					filter: {
						and: [{ contactId: { eq: contact.id } }, { teamId: { eq: team.id } }],
					},
				});

				if (!existingMember.data?.length) {
					await client.models.TeamMember.create({
						contactId: contact.id,
						teamId: team.id,
						role: contact.role || "Other",
					});
				}

				return user;
			})
		);
		console.log("Created/Updated admin users:", adminUsers);

		// 5. Create team members for remaining contacts
		const remainingContacts = contacts.filter(
			(contact) => !adminUsers.some((user) => user.email === contact.contactEmail || user.email === contact.email)
		);

		await Promise.all(
			remainingContacts.map(async (contact) => {
				const existingMember = await client.models.TeamMember.list({
					filter: {
						and: [{ contactId: { eq: contact.id } }, { teamId: { eq: team.id } }],
					},
				});

				if (!existingMember.data?.length) {
					await client.models.TeamMember.create({
						contactId: contact.id,
						teamId: team.id,
						role: contact.role || "Other",
					});
				}
			})
		);

		return {
			company,
			contacts,
			team,
			adminUsers,
		};
	} catch (error) {
		console.error("Setup error:", error);
		throw new Error(`Failed to complete setup: ${error.message}`);
	}
}

// Helper functions remain the same
async function createCompany(companyData) {
	const initializedData = initializeCompanyData(companyData);
	const response = await client.models.Company.create(initializedData);
	if (!response?.data?.id) throw new Error("Failed to create company");
	return response.data;
}

async function createContacts(contacts, companyId) {
	const contactPromises = contacts.map((contact) => {
		const initializedContact = initializeContactData({
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
			notes: `Initial contact created during company setup. Role: ${contact.roleId}`,
			companyId,
		});
		return client.models.Contact.create(initializedContact);
	});

	const responses = await Promise.all(contactPromises);
	return responses.map((response) => response.data);
}

async function createTeam(teamData, companyId) {
	const initializedTeam = initializeTeamData(teamData, companyId);
	const response = await client.models.Team.create(initializedTeam);
	if (!response?.data?.id) throw new Error("Failed to create team");
	return response.data;
}
