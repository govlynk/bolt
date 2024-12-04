import styled from "@emotion/styled";
import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Menu } from "lucide-react"; // Replace MenuOutlinedIcon
import logo from "../../assets/images/logo.png";

const StyledSidebarHeader = styled.div`
	height: 64px;
	min-height: 64px;
	display: flex;
	align-items: center;
	padding: 0 20px;

	> div {
		width: 100%;
		overflow: hidden;
	}
`;

const StyledLogo = styled.div`
	width: 35px;
	min-width: 35px;
	height: 35px;
	min-height: 35px;
	margin: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	color: white;
	font-size: 24px;
	font-weight: 700;
`;

const SidebarHeader = ({ isCollapsed, setIsCollapsed }) => {
	return (
		<StyledSidebarHeader onClick={() => setIsCollapsed(!isCollapsed)} icon={<Menu />}>
			<div style={{ display: "flex", alignItems: "center" }}>
				<StyledLogo>
					<Menu />
				</StyledLogo>
				<img src={logo} alt='Logo' style={{ width: "80%" }} />
			</div>
		</StyledSidebarHeader>
	);
};

export default SidebarHeader;
