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
	Settings2,
	PieChart,
	ChartLine,
	BarChart,
} from "lucide-react";

const profileLinks = {
	id: "profile",
	title: "Profile",
	icon: Users,
	links: [
		{
			title: "File Browser",
			path: "/company-files",
		},
	],
};

// Group related menu items
const salesLinks = {
	id: "sales",
	title: "Sales",
	icon: ChartLine,
	links: [
		{
			title: "Contract Opportunities",
			path: "/opportunities",
		},
		{
			title: "Pipeline",
			path: "/pipeline",
		},
		{
			title: "Sprints",
			path: "/sprints",
		},
		{
			title: "Calendar",
			path: "/calendar",
		},
	],
};

const systemLinks = {
	id: "govlynk",
	title: "GovLynk",
	icon: Settings,
	requiredGroups: ["GOVLYNK_ADMIN"], // Can also protect individual links
	links: [
		{
			title: "Client Setup",
			path: "/client-setup",
		},
		{
			title: "Test",
			path: "/test",
		},
	],
};

// Export organized menu structure
export const menuLinks = [
	{
		id: "home",
		title: "Home",
		icon: Home,
		links: [
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

	profileLinks,

	salesLinks,

	systemLinks,
];
