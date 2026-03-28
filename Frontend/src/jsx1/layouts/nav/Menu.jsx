export const MenuList = [
    { title: 'Dashboard ', to: 'dashboard', iconStyle: <i className="flaticon-home" /> },



    { title: 'Masters', classsChange: 'menu-title' },

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
        iconStyle: <i className="flaticon flaticon-web" />,
        classsChange: 'mm-collapse',
        content: [
            { title: 'Add Intervention', to: 'intervention-form' },
            { title: 'Intervention List', to: 'intervention-List' },
        ]
    },


    {
        title: 'Employee Payment',
        iconStyle: <i className="flaticon flaticon-phone-book" />,
        classsChange: 'mm-collapse',
        content: [
            { title: 'Add Expense', to: '/Add-Expense' },
            { title: 'Payment List', to: '/payment-list' },
            { title: 'Manager List', to: '/manager-list' },
            { title: 'Reviewer List', to: '/reviewer-list' },
            { title: 'Accounts List', to: '/account-list' },

        ]
    },

]