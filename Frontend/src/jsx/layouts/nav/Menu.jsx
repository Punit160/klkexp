export const MenuList = [


    { title: 'Dashboard ', to: 'dashboard', iconStyle: <i className="flaticon-home" /> },

    { title: 'Admin Dashboard', to: '/admin-dashboard', iconStyle: <i className="flaticon-home" /> },
    { title: 'Manager Dashboard ', to: '/manager-dashboard', iconStyle: <i className="flaticon-home" /> },
    
    { title: 'Masters', classsChange: 'menu-title' },
    
    { title: 'User Dashboard ', to: '/user-dashboard', iconStyle: <i className="flaticon-home" /> },    


    {
        title: 'Employee',
        iconStyle: <i className="flaticon flaticon-user" />,
        classsChange: 'mm-collapse',
        content: [
            { title: 'Add Employee', to: 'add-employee' },
            { title: 'Employee List', to: 'employee-List' },
        ]
    },

    {
        title: 'Project Master',
        iconStyle: <i className="flaticon flaticon-file" />,
        classsChange: 'mm-collapse',
        content: [
            { title: 'Add Project', to: 'project-master' },
            { title: 'Project List', to: 'project-list' },
        ]
    },

    {
        title: 'Intervention',
        iconStyle: <i className="flaticon-registration" />,  
        classsChange: 'mm-collapse',
        content: [
            { title: 'Add Intervention', to: 'intervention-form' },
            { title: 'Intervention List', to: 'intervention-List' },
        ]
    },




    {
        title: 'Employee Payment',
       iconStyle: <i className="flaticon-grid" />,
        classsChange: 'mm-collapse',
        content: [
            { title: 'Add Expense', to: '/Add-Expense' },
            { title: 'Payment List', to: '/payment-list' },
            { title: 'Manager List', to: '/manager-list' },
            { title: 'Reviewer List', to: '/reviewer-list' },
            { title: 'Accounts List', to: '/account-list' },

        ]
    },    // Settings Panel
    {
        title: 'Settings',
        classsChange: 'mm-collapse',
  iconStyle: <i className="flaticon-registration" />,
        content: [
            {
                title: 'Role Permission',
                to: '/role/list',
            },

        ],
    },


]