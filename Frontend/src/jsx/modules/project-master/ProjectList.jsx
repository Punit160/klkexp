import React, { useState } from "react";
import { Col, Card, Table } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";

const ProjectMasterList = () => {

    const projects = [
        {
            id: 1,
            projectName: "Solar Plant",
            alloyNumber: "AL-101",
            startDate: "10 Jan 2025",
            endDate: "10 Dec 2025",
            financialYear: "2025-26",
            funderName: "ABC Corp",
            contactPerson: "9876543210",
            contactPersonName: "Rahul",
            projectManager: "Amit",
            projectStatus: "Ongoing"
        },
        {
            id: 2,
            projectName: "Wind Energy",
            alloyNumber: "AL-202",
            startDate: "5 Feb 2024",
            endDate: "30 Nov 2024",
            financialYear: "2024-25",
            funderName: "XYZ Ltd",
            contactPerson: "9999999999",
            contactPersonName: "Vikas",
            projectManager: "Parvesh",
            projectStatus: "Completed"
        },
        {
            id: 3,
            projectName: "Hydro Project",
            alloyNumber: "AL-303",
            startDate: "1 Mar 2023",
            endDate: "1 Oct 2023",
            financialYear: "2023-24",
            funderName: "Power Ltd",
            contactPerson: "8888888888",
            contactPersonName: "Neha",
            projectManager: "Rakesh",
            projectStatus: "On Hold"
        },



    ];

    const columns = [
        { label: "Project Name", key: "projectName" },
        { label: "Alloy Number", key: "alloyNumber" },
        { label: "Start Date", key: "startDate" },
        { label: "End Date", key: "endDate" },
        { label: "Financial Year", key: "financialYear" },
        { label: "Funder Name", key: "funderName" },
        { label: "Contact Person", key: "contactPerson" },
        { label: "Contact Person Name", key: "contactPersonName" },
        { label: "Project Manager", key: "projectManager" },
        { label: "Status", key: "projectStatus" }
    ];

    /* PAGINATION */

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;

    const currentProjects = projects.slice(indexOfFirst, indexOfLast);

    return (
        <>
            <PageTitle activeMenu="Project Master List" motherMenu="Project Master" />

            <Col lg={12}>
                <Card>

                    <Card.Header className="d-flex justify-content-between">
                        <Card.Title>Project Master List</Card.Title>

                        <TableExportActions
                            data={projects}
                            columns={columns}
                            fileName="Project_Master_List"
                        />
                    </Card.Header>

                    <Card.Body>

                        <Table responsive className="text-nowrap">

                            <thead>
                                <tr>
                                    <th>Sno</th>
                                    <th>Project Name</th>
                                    <th>Alloy No.</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Financial Year</th>
                                    <th>Funder</th>
                                    <th>Contact</th>
                                    <th>Contact Name</th>
                                    <th>MOU</th>
                                    <th>Manager</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {currentProjects.map((proj, index) => (
                                    <tr key={proj.id}>

                                        <td>{indexOfFirst + index + 1}</td>

                                        <td>{proj.projectName}</td>
                                        <td>{proj.alloyNumber}</td>
                                        <td>{proj.startDate}</td>
                                        <td>{proj.endDate}</td>
                                        <td>{proj.financialYear}</td>
                                        <td>{proj.funderName}</td>
                                        <td>{proj.contactPerson}</td>
                                        <td>{proj.contactPersonName}</td>
                                        <td>
                                            <button className="btn btn-sm btn-info">
                                                View
                                            </button>
                                        </td>
                                        <td>{proj.projectManager}</td>


                                        <td>
                                            <div className="d-flex align-items-center">
                                                <i
                                                    className={`fa fa-circle me-1 ${proj.projectStatus === "Ongoing"
                                                            ? "text-primary"
                                                            : proj.projectStatus === "Completed"
                                                                ? "text-success"
                                                                : "text-warning"
                                                        }`}
                                                ></i>
                                                {proj.projectStatus}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex">
                                                <button className="btn btn-primary shadow btn-xs sharp me-1">
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>

                                                <button className="btn btn-danger shadow btn-xs sharp">
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </Table>

                        <Pagination
                            totalItems={projects.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />

                    </Card.Body>
                </Card>
            </Col>
        </>
    );
};

export default ProjectMasterList;