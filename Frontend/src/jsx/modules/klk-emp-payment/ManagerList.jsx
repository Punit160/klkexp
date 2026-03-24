import React, { useState } from "react";
import { Table, Card, Col, Button, Modal, Form } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";

const ManagerList = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [reviewData, setReviewData] = useState({
        reviewBy: "",
        decision: "Approve",
        managerApproval: "Pending",
        paymentDate: "",
        remark: "",
    });
const data = [
  {
    id: 1,
    project: "Solar Plant",
    state: "Uttar Pradesh",
    district: "Gautam Buddha Nagar",
    village: "Dadri",
    amount: "50000",
    status: "Pending",
    managerApproval: "Pending",
  },
];

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReviewData({ ...reviewData, [name]: value });
    };

    const handleSubmit = () => {
        console.log("Review Submitted:", {
            ...reviewData,
            id: selectedItem.id,
        });

        setShowModal(false);
    };

    return (
        <>
            <PageTitle activeMenu="Manager Panel" motherMenu="Payment" />

            <Col lg={12}>
                <Card>
                    <Card.Header>
                        <Card.Title>Manager Approval</Card.Title>
                    </Card.Header>

                    <Card.Body>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Sno</th>
                                    <th>Project</th>
                                    <th>State</th>
                                    <th>District</th>
                                    <th>Village</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Manager Approval</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                         <tbody>
  {data.map((item, index) => (
    <tr key={item.id}>
      <td>{index + 1}</td>
      <td>{item.project}</td>
      <td>{item.state}</td>
      <td>{item.district}</td>
      <td>{item.village}</td>
      <td>₹ {item.amount}</td>

      
      <td>
        <div className="d-flex align-items-center">
          <i
            className={`fa fa-circle me-2 ${
              item.status === "Approved"
                ? "text-success"
                : item.status === "Rejected"
                ? "text-danger"
                : "text-warning"
            }`}
            style={{ fontSize: "10px" }}
          ></i>
          {item.status}
        </div>
      </td>


      <td>
        <span
          className={`badge 
          ${
            item.managerApproval === "Approved"
              ? "bg-success"
              : item.managerApproval === "Rejected"
              ? "bg-danger"
              : "bg-secondary"
          }`}
        >
          {item.managerApproval}
        </span>
      </td>

      {/* Action */}
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
                    </Card.Body>
                </Card>
            </Col>


            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Manager Review</Modal.Title>
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
                                    <Form.Label>Manager Approval</Form.Label>
                                    <Form.Select
                                        name="managerApproval"
                                        value={reviewData.managerApproval}
                                        onChange={handleChange}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </Form.Select>
                                </Form.Group>





                                {reviewData.paymentDone === "Yes" && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Payment Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="paymentDate"
                                            value={reviewData.paymentDate}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                )}


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

                    <Button variant="success" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ManagerList;