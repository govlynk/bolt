import React from "react";
import {
	Box,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	IconButton,
	Tooltip,
	Paper,
} from "@mui/material";
import { UserPlus, AlertCircle } from "lucide-react";

const ACCESS_LEVELS = {
	COMPANY_ADMIN: "Company Administrator",
	COMPANY_USER: "Company User",
	GOVLYNK_ADMIN: "Govlynk Administrator",
	GOVLYNK_USER: "Govlynk User",
};

export function AdminTable({ rows, onCognitoIdChange, onAccessLevelChange, onAuthorize, loading }) {
	return (
		<TableContainer component={Paper} sx={{ mb: 3 }}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Cognito ID</TableCell>
						<TableCell>Access Level</TableCell>
						<TableCell align='right'>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.rowId}>
							<TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
							<TableCell>{row.email}</TableCell>
							<TableCell>
								<TextField
									size='small'
									value={row.cognitoId}
									onChange={(e) => onCognitoIdChange(row.id, e.target.value)}
									disabled={row.isAuthorized}
									fullWidth
								/>
							</TableCell>
							<TableCell>
								<FormControl fullWidth size='small'>
									<Select
										value={row.accessLevel}
										onChange={(e) => onAccessLevelChange(row.id, e.target.value)}
										disabled={row.isAuthorized}
									>
										{Object.entries(ACCESS_LEVELS).map(([value, label]) => (
											<MenuItem key={value} value={value}>
												{label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</TableCell>
							<TableCell align='right'>
								<Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
									<Button
										size='small'
										variant='contained'
										onClick={() => onAuthorize(row)}
										disabled={row.isAuthorized || !row.cognitoId || !row.accessLevel}
										startIcon={<UserPlus size={16} />}
									>
										{row.isAuthorized ? "Authorized" : "Authorize"}
									</Button>
									<Tooltip title='User must have Cognito ID and Access Level to be authorized'>
										<IconButton size='small'>
											<AlertCircle size={16} />
										</IconButton>
									</Tooltip>
								</Box>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
