import React from "react";
import { Box, Typography, Drawer, IconButton, Divider, Chip, Link } from "@mui/material";
import { CircleX, Building2, Calendar, MapPin, DollarSign, Mail, Phone, Tag, ExternalLink } from "lucide-react";
import { formatDate, formatCurrency } from "../../utils/formatters";

export function OpportunityDetailsSidebar({ open, onClose, opportunity }) {
	const renderSection = (title, content, icon) => (
		<Box sx={{ mb: 3 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
				{icon}
				<Typography variant='subtitle2' color='text.secondary'>
					{title}
				</Typography>
			</Box>
			<Typography variant='body1'>{content}</Typography>
		</Box>
	);

	const renderContactInfo = (contact) => (
		<Box sx={{ mb: 2 }}>
			<Typography variant='body2'>
				<strong>{contact.pocType}:</strong> {contact.pocName}
			</Typography>
			{contact.pocEmail && (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Mail size={16} />
					<Link href={`mailto:${contact.pocEmail}`}>{contact.pocEmail}</Link>
				</Box>
			)}
			{contact.pocPhone && (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Phone size={16} />
					<Typography variant='body2'>{contact.pocPhone}</Typography>
				</Box>
			)}
		</Box>
	);

	return (
		<Drawer
			anchor='right'
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: { width: "400px" },
			}}
		>
			<Box sx={{ p: 3 }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
					<Typography variant='h6' component='h2'>
						Opportunity Details
					</Typography>
					<IconButton onClick={onClose}>
						<CircleX />
					</IconButton>
				</Box>

				<Divider sx={{ mb: 3 }} />

				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<Box>
						<Typography variant='subtitle2' color='text.secondary' component='div'>
							Title
						</Typography>
						<Typography variant='body1' component='div'>
							{opportunity.title}
						</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary' component='div'>
							Solicitation Number
						</Typography>
						<Typography variant='body1' component='div'>
							{opportunity.solicitationNumber || "N/A"}
						</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary' component='div'>
							Department
						</Typography>
						<Typography variant='body1' component='div'>
							{opportunity.department}
						</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary' component='div'>
							Sub-tier
						</Typography>
						<Typography variant='body1' component='div'>
							{opportunity.subtier || "N/A"}
						</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary' component='div'>
							Office
						</Typography>
						<Typography variant='body1' component='div'>
							{opportunity.office || "N/A"}
						</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary' component='div'>
							Posted Date
						</Typography>
						<Typography variant='body1' component='div'>
							{formatDate(opportunity.postedDate)}
						</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary' component='div'>
							Response Deadline
						</Typography>
						<Typography variant='body1' component='div'>
							{formatDate(opportunity.responseDeadLine)}
						</Typography>
					</Box>

					{opportunity.placeOfPerformance && (
						<Box>
							<Typography variant='subtitle2' color='text.secondary' component='div'>
								Place of Performance
							</Typography>
							<Typography variant='body1' component='div'>
								{`${opportunity.placeOfPerformance.state?.name || ""}, 
						${opportunity.placeOfPerformance.country?.name || ""}`}
							</Typography>
						</Box>
					)}

					{opportunity.award?.amount && (
						<Box>
							<Typography variant='subtitle2' color='text.secondary' component='div'>
								Award Amount
							</Typography>
							<Typography variant='body1' component='div'>
								{formatCurrency(opportunity.award.amount)}
							</Typography>
						</Box>
					)}

					<Box>
						<Typography variant='subtitle2' color='text.secondary' component='div'>
							Set Aside
						</Typography>
						<Typography variant='body1' component='div'>
							{opportunity.setAside || "None"}
						</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary' component='div'>
							NAICS Code
						</Typography>
						<Typography variant='body1' component='div'>
							{opportunity.naicsCode || "N/A"}
						</Typography>
					</Box>

					{opportunity.description && (
						<Box>
							<Typography variant='subtitle2' color='text.secondary' component='div'>
								Description
							</Typography>
							<Typography variant='body2' component='div' sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
								{opportunity.description}
							</Typography>
						</Box>
					)}

					{opportunity.resourceLinks?.length > 0 && (
						<Box>
							<Typography variant='subtitle2' color='text.secondary' component='div'>
								Resources
							</Typography>
							<Box sx={{ mt: 1 }}>
								{opportunity.resourceLinks.map((link, index) => (
									<Link
										key={index}
										href={link}
										target='_blank'
										rel='noopener noreferrer'
										sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
									>
										<ExternalLink size={16} />
										<Typography variant='body2' component='span'>
											Resource {index + 1}
										</Typography>
									</Link>
								))}
							</Box>
						</Box>
					)}
				</Box>
			</Box>
		</Drawer>
	);
}
