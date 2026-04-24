import React, { useEffect, useState } from "react";
import { Table, Card, Col, Modal, Button, Form } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";

const PaymentList = () => {

  const [expenses, setExpenses] = useState([]);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}expense/view-my-expense`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        console.log("EXPENSES", data);

        setExpenses(data || []);

      } catch (error) {
        console.error(error);
      }
    };

    fetchExpenses();
  }, []);

  /* ---------------- EXPORT ---------------- */
/* ---------------- EXPORT ---------------- */
const columns = [
  { label: "Project", key: "project_name" },
  { label: "State", key: "state" },          
  { label: "District", key: "district" },    
  { label: "Village", key: "village" },     
  { label: "Intervention", key: "intervention_name" },  
  { label: "Raised By", key: "raised_by" },            
  { label: "Manager", key: "manager_name" },         
  { label: "Amount", key: "amount" },
  { label: "Approved Amount", key: "final_approved_amount" },  
  { label: "Document", key: "document" },             
  { label: "Request Date", key: "created_at" },
  { label: "Payment Amount", key: "payment_amount" },   
  { label: "Reviewer Status", key: "reviewer_status" }, 
  { label: "Approval Status", key: "Approval_status" }, 
  { label: "Payment Status", key: "payment_status" },  
];


const exportData = expenses.map(item => ({
  ...item,
  payment_status:
    item.payment_status === 2 ? "Paid" :
    item.payment_status === 1 ? "Partially Paid" : "Pending",
}));

  /* ---------------- PAGINATION ---------------- */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = expenses.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <PageTitle activeMenu="Payment List" motherMenu="Payment" />

      <Col lg={12}>
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <Card.Title>Payment Workflow</Card.Title>

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
                  <th>Intervention</th>
                  <th>Raised By</th>
                  <th>Manager</th>
                  <th>Amount</th>
                  <th>Approved Amount</th>
                  <th>Document</th>
                  <th>Request Date</th>
                  <th>Payment Amount</th>
                  <th>Reviewer Status</th>
                  <th>Approval Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>

              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{indexOfFirst + index + 1}</td>

                      <td>{item.project_name}</td>
                      <td>{item.state || "N/A"}</td>
                      <td>{item.district || "N/A"}</td>
                      <td>{item.village || "N/A"}</td>

                      <td>{item.intervention_name || "N/A"}</td>

                      <td>{item.raised_by || "N/A"}</td>
                      <td>{item.manager_name || "N/A"}</td>

                      <td>₹ {item.amount}</td>
                      <td>₹ {item.final_approved_amount || "0"}</td>

                      {/* Document */}
                      <td>
                        {item.document ? (
                          <a
                            href={`${import.meta.env.VITE_BACKEND_BASE_URL}/uploads/${item.document}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary"
                          >
                            View
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>

                      {/* Date */}
                      <td>
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>

                      {/* Payment Amount */}
                      <td>₹ {item.payment_amount || "0"}</td>

                      {/* Reviewer status */}
                      <td>
                        <span
                          className={`badge ${item.reviewer_status === "Approved"
                              ? "bg-success"
                              : item.reviewer_status === "Rejected"
                                ? "bg-danger"
                                : item.reviewer_status === "Pending"
                                  ? "bg-warning"
                                  : "bg-secondary"
                            }`}
                        >
                          {item.reviewer_status || "N/A"}
                        </span>
                      </td>

                      {/* Approval Status */}
                      <td>
                        <span
                          className={`badge ${item.Approval_status === "Approved"
                              ? "bg-success"
                              : item.Approval_status === "Rejected"
                                ? "bg-danger"
                                : "bg-warning"
                            }`}
                        >
                          {item.Approval_status}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${item.payment_status === 2
                              ? "bg-success"      // Paid
                              : item.payment_status === 1
                                ? "bg-info"         // Partially Paid
                                : "bg-warning"      // Pending
                            }`}
                        >
                          {item.payment_status === 2
                            ? "Paid"
                            : item.payment_status === 1
                              ? "Partially Paid"
                              : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="16" className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* PAGINATION */}
            <Pagination
              totalItems={expenses.length}
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

export default PaymentList;