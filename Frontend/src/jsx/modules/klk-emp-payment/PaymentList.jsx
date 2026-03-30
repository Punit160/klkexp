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
          "http://localhost:5001/api/expense/view-my-expense",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        console.log("EXPENSES 👉", data);

        setExpenses(data || []);

      } catch (error) {
        console.error(error);
      }
    };

    fetchExpenses();
  }, []);

  /* ---------------- EXPORT ---------------- */
  const columns = [
    { label: "Project", key: "project_name" },
    { label: "State", key: "project_state" },
    { label: "District", key: "project_district" },
    { label: "Village", key: "project_village" },
    { label: "Amount", key: "amount" },
    { label: "Request Date", key: "created_at" },
  ];

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
              data={expenses}
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
                  <th>Request Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{indexOfFirst + index + 1}</td>

                      <td>{item.project_name}</td>
                      <td>{item.project_state}</td>
                      <td>{item.project_district}</td>
                      <td>{item.project_village}</td>
                      <td>{item.intervention_name}</td>
                      <td>₹ {item.amount}</td> 
                      

                      {/* Document */}
                      <td>
                        {item.document ? (
                          <a
                            href={`http://localhost:5001/uploads/${item.document}`}
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

                      {/* Status (default 0) */}
                      <td>
                        <span className="badge bg-warning">
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
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