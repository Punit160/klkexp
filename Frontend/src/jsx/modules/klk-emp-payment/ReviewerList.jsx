import React, { useState } from "react";
import { Table, Card, Col, Modal, Button, Form } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";

const ReviewerList = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [reviewData, setReviewData] = useState({
        paymentMode: "Cash",
        amount: "",
        reference: "",
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
            remarks: "Check documents",
        },
        {
            id: 2,
            project: "Wind Project",
            state: "Delhi",
            district: "New Delhi",
            village: "Karol Bagh",
            amount: "20000",
            remarks: "Pending verification",
        },
    ]);

    /* ---------------- EXPORT DATA ---------------- */
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
        { label: "Remarks", key: "remarks" },
    ];

    /* ---------------- PAGINATION ---------------- */
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentData = data.slice(indexOfFirst, indexOfLast);

    /* ---------------- HANDLERS ---------------- */

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReviewData({ ...reviewData, [name]: value });
    };

    const handleSubmit = () => {
        console.log("Reviewer Data:", {
            ...reviewData,
            id: selectedItem.id,
        });

        setShowModal(false);
    };

    return (
        <>
            <PageTitle activeMenu="Reviewer Panel" motherMenu="Payment" />

            <Col lg={12}>
                <Card>

                    <Card.Header className="d-flex justify-content-between">
                        <Card.Title>Reviewer Tasks</Card.Title>

                        <TableExportActions
                            data={exportData}
                            columns={columns}
                            fileName="Reviewer_List"
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
                                    <th>Remarks</th>
                                    <th>Action</th>
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
                                        <td>{item.remarks}</td>

                                        <td>
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => handleOpenModal(item)}
                                            >
                                                Review
                                            </Button>
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

            {/* ---------------- REVIEW MODAL ---------------- */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reviewer Form</Modal.Title>
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
                                    <Form.Label>Payment Mode</Form.Label>
                                    <Form.Select
                                        name="paymentMode"
                                        value={reviewData.paymentMode}
                                        onChange={handleChange}
                                    >
                                        <option>Cash</option>
                                        <option>Bank</option>
                                        <option>UPI</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        value={reviewData.amount}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Reference</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reference"
                                        value={reviewData.reference}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Remark</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="remark"
                                        value={reviewData.remark}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Form>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>

                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ReviewerList;