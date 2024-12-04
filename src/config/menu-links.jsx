import {
	Home,
	Users,
	Contact2,
	Receipt,
	User,
	Medal,
	ListTodo,
	Building2,
	UserCog,
	Settings,
	Search,
	Briefcase,
	DollarSign,
	PieChart,
} from "lucide-react";

export const menuLinks = [
	{
		id: "home",
		title: "Home",
		icon: Home,
		links: [
			{
				title: "Welcome",
				path: "/welcome",
			},
			{
				title: "Dashboard",
				path: "/dashboard",
			},
			{
				title: "To Do",
				path: "/todos",
			},
		],
	},
	{
		id: "profile",
		title: "Profile",
		icon: Users,
		links: [
			{
				title: "Readieness Assessment",
				path: "/assessment",
			},
			{
				title: "SAM Registration",
				path: "/sam",
			},
		],
	},
	{
		id: "Company Admin",
		title: "Administration",
		icon: Users,
		links: [
			{
				title: "Manage Contacts",
				path: "/contacts",
			},
			{
				title: "Manage Team",
				path: "/team",
			},
		],
	},
	{
		id: "market",
		title: "Market Intelligence",
		icon: PieChart,
		links: [
			{
				title: "Contract Opportunities",
				path: "/opportunities",
			},
			{
				title: "Spending Analysis",
				path: "/spending-analysis",
			},
			{
				title: "Pipeline",
				path: "/pipeline",
			},
		],
	},
	{
		id: "awards",
		title: "Awards",
		icon: Medal,
		links: [
			{
				title: "Past Awards",
				path: "/awards",
			},
		],
	},
	{
		id: "finance",
		title: "Finance",
		icon: Receipt,
		links: [
			{
				title: "Invoices Balances",
				path: "/invoices",
			},
		],
	},
	{
		id: "admin",
		title: "Admin",
		icon: Settings,
		links: [
			{
				title: "Client Setup",
				path: "/client-setup",
			},
			{
				title: "Company Admin",
				path: "/admin",
			},
			{
				title: "User Admin",
				path: "/user-admin",
			},
			{
				title: "Contact Admin",
				path: "/contact-admin",
			},
			{
				title: "User Company Roles",
				path: "/user-company-roles",
			},
			{
				title: "Color Sections",
				path: "/color-sections",
			},
			{
				title: "Menu Manager",
				path: "/menu-manager",
			},
		],
	},
];
