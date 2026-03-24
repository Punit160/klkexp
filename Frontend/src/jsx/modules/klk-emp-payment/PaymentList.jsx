import React, { useState } from "react";
import { Table, Card, Col, Modal, Button, Form } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";

const PaymentList = () => {

  const [showModal, setShowModal] = useState(false);

  /* ---------------- DATA ---------------- */
  const data = [
    {
      id: 1,
      project: "Solar Plant",
      state: "Uttar Pradesh",
      district: "Gautam Buddha Nagar",
      village: "Dadri",
      intervention: "Maintenance",
      amount: "50000",
      document: "file1.pdf",
      requestedBy: "Mohit",
      requestDate: "2026-03-20",
      approval: "Pending",
      paymentDone: "No", 
      remarks: "Urgent work",
    },
    {
      id: 2,
      project: "Wind Project",
      state: "Delhi",
      district: "New Delhi",
      village: "Karol Bagh",
      intervention: "Repair",
      amount: "20000",
      document: "file2.pdf",
      requestedBy: "Rahul",
      requestDate: "2026-03-18",
      approval: "Approved",
      paymentDone: "Yes",
      remarks: "Approved by manager",
    },
  ];

  /* ---------------- EXPORT ---------------- */
  const columns = [
    { label: "Project", key: "project" },
    { label: "State", key: "state" },
    { label: "District", key: "district" },
    { label: "Village", key: "village" },
    { label: "Intervention", key: "intervention" },
    { label: "Amount", key: "amount" },
    { label: "Requested By", key: "requestedBy" },
    { label: "Request Date", key: "requestDate" },
    { label: "Approval", key: "approval" },
    { label: "Remarks", key: "remarks" },
    { label: "Status", key: "status" },
  ];

  /* ---------------- PAGINATION ---------------- */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);



  return (
    <>
      <PageTitle activeMenu="Payment List" motherMenu="Payment" />

      <Col lg={12}>
        <Card>
          {/* HEADER */}
          <Card.Header className="d-flex justify-content-between">
            <Card.Title>Payment Workflow</Card.Title>

            <TableExportActions
              data={data}
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
                  <th>Intervention</th>
                  <th>Amount</th>
                  <th>Document</th>
                  <th>Requested By</th>
                  <th>Request Date</th>
                  <th>Approval</th>
                  <th>Payment Done</th>
                  <th>Remarks</th>
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
                    <td>{item.intervention}</td>
                    <td>₹ {item.amount}</td>

                    <td>
                      <a href="#" className="text-primary">
                        View
                      </a>
                    </td>

                    <td>{item.requestedBy}</td>
                    <td>{new Date(item.requestDate).toLocaleDateString()}</td>

                    {/* Approval */}
                    <td>
                      <span
                        className={`badge 
          ${item.approval === "Approved"
                            ? "bg-success"
                            : item.approval === "Rejected"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                      >
                        {item.approval}
                      </span>
                    </td>

                    {/* Payment Done */}
                    <td>
                      <span
                        className={`badge 
          ${item.paymentDone === "Yes" ? "bg-success" : "bg-danger"}`}
                      >
                        {item.paymentDone}
                      </span>
                    </td>

                    <td>{item.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* PAGINATION */}
            <Pagination
              totalItems={data.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </Card.Body>
        </Card>
      </Col>

      {/* ASSIGN MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Reviewer</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Reviewer</Form.Label>
              <Form.Select>
                <option>Select</option>
                <option>Rahul</option>
                <option>Amit</option>
                <option>Neha</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Remarks</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">Assign</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PaymentList;