import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Routes, Route, Outlet } from "react-router-dom";
import Nav from "../layouts/nav";
import Footer from "../layouts/Footer";
// dashboard 
import Home from "../pages/dashboard/Home";
import DashboardDark from "../pages/dashboard/DashboardDark";

// forms 
import Element from "../pages/forms/Element/Element";
import Wizard from "../pages/forms/Wizard/Wizard";
import CkEditor from "../pages/forms/CkEditor/CkEditor";
import Pickers from "../pages/forms/Pickers/Pickers";
import FormValidation from "../pages/forms/FormValidation/FormValidation";
// table 
import BootstrapTable from "../pages/table/BootstrapTable";
import DataTable from "../pages/table/DataTable";
// pages 
import Error400 from "../pages/error/Error400";
import EmptyPage from "../pages/error/emptypage";

import Login from "../pages/authentication/Login";
import Registration from "../pages/authentication/Registration";
import ScrollToTop from "../element/scrolltotop";


import AddEmployee from "../modules/Employee/AddEmployee";
import EmployeeList from "../modules/employee/EmployeeList";
import ProjectMasterForm from "../modules/project-master/ProjectForm";
import ProjectMasterList from "../modules/project-master/ProjectList";
import InterventionForm from "../modules/intervention/InterventionForm";
import InterventionList from "../modules/intervention/InterventionList";
import PaymentList from "../modules/klk-emp-payment/PaymentList";
import ReviewerList from "../modules/klk-emp-payment/ReviewerList";
import AccountsList from "../modules/klk-emp-payment/AccountsList";
import ManagerList from "../modules/klk-emp-payment/ManagerList";
import AddExpense from "../modules/klk-emp-payment/AddExpense";
import UpdateEmployee from "../modules/Employee/UpdateEmployee";
import ProjectFormUpdate from "../modules/project-master/ProjectFromUpdate";

const Markup = () => {
    const menu = [
        { path: '/', element: <Home /> },
        { path: 'dashboard', element: <Home /> },
        { path: 'dashboard-dark', element: <DashboardDark /> },


        { path: '/add-employee', element: <AddEmployee /> },
        { path: '/employee-List', element: <EmployeeList /> },
        { path: '/update-employee/:id', element: <UpdateEmployee /> },


        { path: '/project-master', element: <ProjectMasterForm /> },
        { path: '/project-list', element: < ProjectMasterList /> },
        {
            path: "/project-edit/:id",
            element: <ProjectFormUpdate />,
        },


        { path: '/intervention-Form', element: < InterventionForm /> },
        { path: '/intervention-List', element: < InterventionList /> },

        


        { path: '/Add-Expense', element: <AddExpense /> },
        { path: '/payment-list', element: <PaymentList /> },
        { path: '/Reviewer-List', element: <ReviewerList /> },
        { path: '/Manager-List', element: <ManagerList /> },
        { path: '/Account-List', element: <AccountsList /> },





        { path: 'form-element', element: <Element /> },
        { path: 'form-wizard', element: <Wizard /> },
        { path: 'form-ckeditor', element: <CkEditor /> },
        { path: 'form-pickers', element: <Pickers /> },
        { path: 'form-validation', element: <FormValidation /> },
        { path: 'table-bootstrap-basic', element: <BootstrapTable /> },
        { path: 'table-datatable-basic', element: <DataTable /> },
        { path: 'error-400', element: <Error400 /> },

        { path: 'empty-page', element: <EmptyPage /> },
        { path: 'login', element: <Login /> },
        { path: 'registration', element: <Registration /> },
    ]

    return (
        <>
            <Routes>
                <Route path='page-error-400' element={<Error400 />} />

                <Route path='page-login' element={<Login />} />
                <Route path='page-register' element={<Registration />} />
                <Route element={<MainLayout />}>
                    {menu.map((item, index) => (
                        <Route key={index} path={item.path} element={item.element} />
                    ))}
                </Route>
            </Routes>
            <ScrollToTop />
        </>
    );
};

function MainLayout() {
    const { menuToggle, sidebariconHover } = useContext(ThemeContext);
    return (
        <>
            <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle" : ""} ${menuToggle ? "menu-toggle" : ""}`} >
                <Nav />
                <div className="content-body" style={{ minHeight: "849px" }}>
                    <div className="container-fluid">
                        <Outlet />
                    </div>
                </div>
                <Footer />
            </div>

        </>
    );
}

export default Markup;