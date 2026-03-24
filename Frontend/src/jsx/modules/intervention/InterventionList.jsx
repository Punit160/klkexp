import React, { useState } from "react";
import { Col, Card, Table } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";

const InterventionList = () => {

    const interventions = [
        { id: 1, intervention: "Solar Maintenance", amount: "50000", status: "Active" },
        { id: 2, intervention: "Panel Cleaning", amount: "15000", status: "Active" },
        { id: 3, intervention: "Repair Work", amount: "25000", status: "Inactive" },
        { id: 4, intervention: "Inspection", amount: "10000", status: "Active" },
        { id: 5, intervention: "Upgrade", amount: "70000", status: "Inactive" }
    ];

    const columns = [
        { label: "Intervention", key: "intervention" },
        { label: "Amount", key: "amount" },
        { label: "Status", key: "status" }
    ];

    /* PAGINATION */
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;

    const currentData = interventions.slice(indexOfFirst, indexOfLast);

    return (
        <>
            <PageTitle activeMenu="Intervention List" motherMenu="Intervention" />

            <Col lg={12}>
                <Card>

                    {/* SAME HEADER STYLE */}
                    <Card.Header className="d-flex justify-content-between">
                        <Card.Title>Intervention List</Card.Title>

                        <TableExportActions
                            data={interventions}
                            columns={columns}
                            fileName="Intervention_List"
                        />
                    </Card.Header>

                    <Card.Body>

                        {/* SAME TABLE STYLE */}
                        <Table responsive className="text-nowrap">

                            <thead>
                                <tr>
                                    <th>Sno</th>
                                    <th>Intervention</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirst + index + 1}</td>
                                        <td>{item.intervention}</td>
                                        <td>₹ {item.amount}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <i
                                                    className={`fa fa-circle me-1 ${item.status === "Active"
                                                        ? "text-success"
                                                        : "text-danger"
                                                        }`}
                                                ></i>
                                                {item.status}
                                            </div>
                                        </td>


                                        <td>
                                            <div className="d-flex justify-content-end align-items-center gap-2">

                                                <button className="btn btn-primary shadow btn-xs sharp">
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

                        {/* SAME PAGINATION */}
                        <Pagination
                            totalItems={interventions.length}
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

export default InterventionList;