import React, { useState } from "react";
import { Table, Card, Col, Modal, Button, Form } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";

const ReviewerList = () => {

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [reviewData, setReviewData] = useState({
    paymentMode: "Cash",
    amount: "",
    reference: "",
    remark: "",
  });

  const data = [
    {
      id: 1,
      project: "Solar Plant",
      amount: "50000",
      remarks: "Check documents",
    },
  ];

  /* ---------------- OPEN MODAL ---------------- */
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  /* ---------------- SUBMIT ---------------- */
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
          <Card.Header>
            <Card.Title>Reviewer Tasks</Card.Title>
          </Card.Header>

          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Sno</th>
                  <th>Project</th>
                  <th>Amount</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.project}</td>
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
              {/* Top Info */}
              <div className="d-flex justify-content-between mb-3">
                <span><strong>Project:</strong> {selectedItem.project}</span>
                <span><strong>Amount:</strong> ₹ {selectedItem.amount}</span>
              </div>

              <Form>
                {/* Payment Mode */}
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

                {/* Amount */}
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={reviewData.amount}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Reference */}
                <Form.Group className="mb-3">
                  <Form.Label>Reference</Form.Label>
                  <Form.Control
                    type="text"
                    name="reference"
                    value={reviewData.reference}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Remark */}
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