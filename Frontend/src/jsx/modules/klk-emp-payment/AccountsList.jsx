import React, { useState } from "react";
import { Table, Card, Col, Modal, Button, Form } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";

const PaymentList = () => {

    const [showAccountModal, setShowAccountModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [accountData, setAccountData] = useState({
        amount: "",
        decision: "Approve",
        paymentReference: "",
        remark: "",
    });

    const [data, setData] = useState([
        {
            id: 1,
            project: "Solar Plant",
            state: "Uttar Pradesh",
            district: "Gautam Buddha Nagar",
            village: "Dadri",
            amount: "50000",
            paymentStatus: "Pending",
            approvedBy: "Manager",
        },
        {
            id: 2,
            project: "Wind Project",
            state: "Delhi",
            district: "New Delhi",
            village: "Karol Bagh",
            amount: "20000",
            paymentStatus: "Completed",
            approvedBy: "Admin",
        },
    ]);

        const exportData = data.map((item, index) => ({
        sno: index + 1,
        ...item,
    }));

    const columns = [
        { label: "Sno", key: "sno" },
        { label: "Project", key: "project" },
        { label: "State", key: "state" },
        { label: "District", key: "district" },
        { label: "Village", key: "village" },
        { label: "Amount", key: "amount" },
        { label: "Payment Status", key: "paymentStatus" },
        { label: "Approved By", key: "approvedBy" },
    ];

    /* ---------------- PAGINATION ---------------- */
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentData = data.slice(indexOfFirst, indexOfLast);

    /* ---------------- HANDLERS ---------------- */

    const handleAccount = (item) => {
        setSelectedItem(item);
        setShowAccountModal(true);
    };

    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setAccountData({ ...accountData, [name]: value });
    };

    const handleAccountSubmit = () => {
        const updatedData = data.map((item) => {
            if (item.id === selectedItem.id) {
                return {
                    ...item,
                    paymentStatus:
                        accountData.decision === "Approve"
                            ? "Completed"
                            : "Rejected",
                };
            }
            return item;
        });

        setData(updatedData);
        setShowAccountModal(false);
    };

    return (
        <>
            <PageTitle activeMenu="Payment List" motherMenu="Payment" />

            <Col lg={12}>
                <Card>

                    <Card.Header className="d-flex justify-content-between">
                        <Card.Title>Accounts Payment List </Card.Title>

                    <TableExportActions
                            data={exportData}
                            columns={columns}
                            fileName="Payment_List"
                        />
                    </Card.Header>

                    <Card.Body>
                        <Table responsive className="text-nowrap">
                            <thead>
                                <tr>
                                    <th>Sno</th>
                                    <th>Project</th>
                                    <th>State</th>
                                    <th>District</th>
                                    <th>Village</th>
                                    <th>Amount</th>
                                    <th>Payment Status</th>
                                    <th>Approved By</th>
                                    <th>Accounts</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirst + index + 1}</td>
                                        <td>{item.project}</td>
                                        <td>{item.state}</td>
                                        <td>{item.district}</td>
                                        <td>{item.village}</td>
                                        <td>₹ {item.amount}</td>

                                        <td>
                                            <div className="d-flex align-items-center">
                                                <i
                                                    className={`fa fa-circle me-2 ${
                                                        item.paymentStatus === "Completed"
                                                            ? "text-success"
                                                            : item.paymentStatus === "Rejected"
                                                            ? "text-danger"
                                                            : "text-warning"
                                                    }`}
                                                    style={{ fontSize: "10px" }}
                                                ></i>
                                                {item.paymentStatus}
                                            </div>
                                        </td>

                                        <td>
                                            <span className="badge bg-primary">
                                                {item.approvedBy || "N/A"}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="btn btn-success btn-xs"
                                                onClick={() => handleAccount(item)}
                                                disabled={item.paymentStatus !== "Pending"}
                                            >
                                                Pay
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Pagination
                            totalItems={data.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </Card.Body>
                </Card>
            </Col>

            {/* ---------------- ACCOUNTS MODAL ---------------- */}
            <Modal show={showAccountModal} onHide={() => setShowAccountModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Accounts Payment</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedItem && (
                        <>
                            <div className="d-flex justify-content-between mb-3">
                                <span><strong>Project:</strong> {selectedItem.project}</span>
                                <span><strong>Amount:</strong> ₹ {selectedItem.amount}</span>
                            </div>

                            <Form>

                                <Form.Group className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        value={accountData.amount}
                                        onChange={handleAccountChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Decision</Form.Label>
                                    <Form.Select
                                        name="decision"
                                        value={accountData.decision}
                                        onChange={handleAccountChange}
                                    >
                                        <option value="Approve">Approve</option>
                                        <option value="Disapprove">Disapprove</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Payment Reference</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="paymentReference"
                                        value={accountData.paymentReference}
                                        onChange={handleAccountChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Remark</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="remark"
                                        value={accountData.remark}
                                        onChange={handleAccountChange}
                                    />
                                </Form.Group>

                            </Form>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAccountModal(false)}>
                        Cancel
                    </Button>

                    <Button variant="primary" onClick={handleAccountSubmit}>
                        Process Payment
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PaymentList;