import React, { useState } from "react";
import { Table, Card, Col, Modal, Button, Form } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";

const PaymentList = () => {

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [accountData, setAccountData] = useState({
    budget: "",
    paymentMode: "Cash",
    paymentDate: "",
  });

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
      requestedBy: "Mohit",
      requestDate: "2026-03-20",
      approval: "Pending",
      remarks: "Urgent work",
      status: "Pending Manager",
    },
    {
      id: 2,
      project: "Wind Project",
      state: "Delhi",
      district: "New Delhi",
      village: "Karol Bagh",
      intervention: "Repair",
      amount: "20000",
      requestedBy: "Rahul",
      requestDate: "2026-03-18",
      approval: "Approved",
      remarks: "Approved by manager",
      status: "Pending Accounts",
    },
  ];

  /* ---------------- PAGINATION ---------------- */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);

  /* ---------------- HANDLERS ---------------- */

  const handleAssign = (item) => {
    setSelectedItem(item);
    setShowAssignModal(true);
  };

  const handleAccount = (item) => {
    setSelectedItem(item);
    setShowAccountModal(true);
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData({ ...accountData, [name]: value });
  };

  const handleAccountSubmit = () => {
    console.log("Payment Processed:", {
      ...accountData,
      id: selectedItem.id,
    });
    setShowAccountModal(false);
  };

  return (
    <>
      <PageTitle activeMenu="Payment List" motherMenu="Payment" />

      <Col lg={12}>
        <Card>

          <Card.Header className="d-flex justify-content-between">
            <Card.Title>Payment Workflow</Card.Title>

            <TableExportActions
              data={data}
              columns={[]}
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
                  <th>Status</th>
                  <th>Assign</th>
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
                      <span className="badge bg-warning">
                        {item.status}
                      </span>
                    </td>

                    {/* Assign */}
                    <td>
                      <button
                        className="btn btn-info btn-xs"
                        onClick={() => handleAssign(item)}
                      >
                        Assign
                      </button>
                    </td>

                    {/* Accounts */}
                    <td>
                      <button
                        className="btn btn-success btn-xs"
                        onClick={() => handleAccount(item)}
                        disabled={item.status !== "Pending Accounts"}
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

      {/* ---------------- ASSIGN MODAL ---------------- */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
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
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => setShowAssignModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

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
                  <Form.Label>Budget</Form.Label>
                  <Form.Control
                    type="number"
                    name="budget"
                    value={accountData.budget}
                    onChange={handleAccountChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Mode</Form.Label>
                  <Form.Select
                    name="paymentMode"
                    value={accountData.paymentMode}
                    onChange={handleAccountChange}
                  >
                    <option>Cash</option>
                    <option>Bank</option>
                    <option>UPI</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="paymentDate"
                    value={accountData.paymentDate}
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