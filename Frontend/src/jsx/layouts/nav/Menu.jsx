export const MenuList = [
  { 
    title: 'Dashboard', 
    to: 'dashboard', 
    iconStyle: <i className="flaticon-home" />,
    permission: "view_dashboard"
  },

  { title: 'Masters', classsChange: 'menu-title' },

  {
    title: 'Employee',
    iconStyle: <i className="flaticon flaticon-user" />,
    classsChange: 'mm-collapse',
    permission: "view_user",
    content: [
      { title: 'Add Employee', to: 'add-employee', permission: "create_user" },
      { title: 'Employee List', to: 'employee-List', permission: "view_user" },
    ]
  },

  {
    title: 'Project Master',
    iconStyle: <i className="flaticon flaticon-file" />,
    classsChange: 'mm-collapse',
    permission: "view_project",
    content: [
      { title: 'Add Project', to: 'project-master', permission: "create_project" },
      { title: 'Project List', to: 'project-list', permission: "view_project" },
    ]
  },

  {
    title: 'Intervention',
    iconStyle: <i className="flaticon-registration" />,
    classsChange: 'mm-collapse',
    permission: "view_intervention",
    content: [
      { title: 'Add Intervention', to: 'intervention-form', permission: "create_intervention" },
      { title: 'Intervention List', to: 'intervention-List', permission: "view_intervention" },
    ]
  },

  {
    title: 'Employee Payment',
    iconStyle: <i className="flaticon-grid" />,
    classsChange: 'mm-collapse',
    permission: "view_expense",
    content: [
      { title: 'Add Expense', to: '/Add-Expense', permission: "create_expense" },
      { title: 'Payment List', to: '/payment-list', permission: "view_expense" },
      { title: 'Manager List', to: '/manager-list', permission: "manager_expense" },
      { title: 'Reviewer List', to: '/reviewer-list', permission: "reviewer_expense" },
      { title: 'Accounts List', to: '/account-list', permission: "account_expense" },
    ]
  },

  {
    title: 'Settings',
    classsChange: 'mm-collapse',
    iconStyle: <i className="flaticon-registration" />,
    permission: "view_settings",
    content: [
      { title: 'Role Permission', to: '/role/list', permission: "view_role" },
      { title: 'Add Role', to: '/role/add-role', permission: "create_role" },
      { title: 'Add Permission', to: '/permission/add-permission', permission: "create_permission" },
      { title: 'Permission List', to: '/permission/list', permission: "view_permission" },
    ],
  },
];