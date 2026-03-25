import React, { useState, useEffect } from "react";
import { Col, Card, Table } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import avatar1 from "../../../assets/images/User.jpg";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";
import { getAllEmployees, deleteEmployee } from "./employeeApi";

const EmployeeList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllEmployees();
      setData(res);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [location.state]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    const { ok, result } = await deleteEmployee(id);
    if (ok) {
      alert("Employee deleted ");
      fetchUsers();
    } else {
      alert(result.message || "Failed ");
    }
  };

  // PAGINATION
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEmployees = data.slice(indexOfFirst, indexOfLast);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <>
      <PageTitle activeMenu="Employee List" motherMenu="Employee" />

      <Col lg={12}>
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <Card.Title>Employee List</Card.Title>

            <TableExportActions
              data={data}
              columns={[
                { label: "Name", key: "username" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone_no" },
                { label: "Designation", key: "designation" },
                { label: "Reporting Head", key: "reporting_head" },
                { label: "Status", key: "status" },
              ]}
              fileName="Employee_List"
            />
          </Card.Header>

          <Card.Body>
            <Table responsive className="text-nowrap">
              <thead>
                <tr>
                  <th>Sno</th>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Designation</th>
                  <th>Reporting Head</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentEmployees.length > 0 ? (
                  currentEmployees.map((emp, index) => (
                    <tr key={emp.id || index}>
                      <td>{indexOfFirst + index + 1}</td>

                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              emp.user_img
                                ? `${import.meta.env.VITE_BACKEND_BASE_URL}/uploads/${emp.user_img}`
                                : avatar1
                            }
                            className="rounded-lg me-2"
                            width="30"
                            alt=""
                          />
                          <span>{emp.username || "N/A"}</span>
                        </div>
                      </td>

                      <td>{emp.email || "N/A"}</td>
                      <td>{emp.phone_no || "N/A"}</td>
                      <td>{emp.designation || "N/A"}</td>
                      <td>{emp.reporting_head || "N/A"}</td>

                      <td>
                        <div className="d-flex align-items-center">
                          <i
                            className={`fa fa-circle me-1 ${emp.status ? "text-success" : "text-danger"
                              }`}
                          ></i>
                          {emp.status ? "Active" : "Inactive"}
                        </div>
                      </td>

                      <td>
                        <div className="d-flex">
                          <button
                            className="btn btn-primary shadow btn-xs sharp me-1"
                            onClick={() =>
                              navigate(`/update-employee/${emp.id}`)
                            }
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </button>

                          <button
                            className="btn btn-danger shadow btn-xs sharp"
                            onClick={() => handleDelete(emp.id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
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
    </>
  );
};

export default EmployeeList;