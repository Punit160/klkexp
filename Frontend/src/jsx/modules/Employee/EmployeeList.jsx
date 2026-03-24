import React, { useState, useEffect } from "react";
import { Col, Card, Table } from "react-bootstrap";
import avatar1 from "../../../assets/images/User.jpg";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";
import { useNavigate, useLocation } from "react-router-dom";

// API
import { getEmployees, deleteEmployee } from "../APIS/employeeApi";

const EmployeeList = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ for auto refresh

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ FETCH USERS
  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await getEmployees();

      console.log("Employee API:", res);

      setData(res.data || res || []);
    } catch (err) {
      console.log("Employee API Error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ AUTO REFRESH AFTER UPDATE
  useEffect(() => {
    fetchUser();
  }, [location.state]);

  // ✅ DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await deleteEmployee(id);

      setData((prev) => prev.filter((emp) => emp.id !== id));

      alert("Employee deleted successfully");
    } catch (error) {
      console.log("Delete Error:", error);
      alert("Delete failed");
    }
  };

  // ✅ PAGINATION
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentEmployees = data.slice(indexOfFirst, indexOfLast);

  // ✅ LOADING / ERROR
  if (loading) return <p className="text-center">Loading employees...</p>;
  if (error) return <p className="text-center">Error loading data</p>;

  return (
    <>
      <PageTitle activeMenu="Employee List" motherMenu="Employee" />

      <Col lg={12}>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>Employee List</Card.Title>

            {/* ✅ EXPORT */}
            <TableExportActions
              data={data}
              columns={[
                { label: "Name", key: "username" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone_no" },
                { label: "Designation", key: "designation" },
                { label: "Manager", key: "reporting_head" },
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
                  <th>Manager</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentEmployees.length > 0 ? (
                  currentEmployees.map((emp, index) => (
                    <tr key={emp.id}>
                      <td>{indexOfFirst + index + 1}</td>

                      {/* ✅ EMPLOYEE */}
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              emp.user_img
                                ? emp.user_img.startsWith("http")
                                  ? emp.user_img
                                  : `http://localhost:5001/uploads/${emp.user_img}`
                                : avatar1
                            }
                            className="rounded-circle me-2"
                            width="30"
                            height="30"
                            alt="user"
                          />
                          <span>{emp.username || "N/A"}</span>
                        </div>
                      </td>

                      <td>{emp.email || "N/A"}</td>
                      <td>{emp.phone_no || "N/A"}</td>
                      <td>{emp.designation || "N/A"}</td>
                      <td>{emp.reporting_head || "N/A"}</td>

                      {/* ✅ STATUS */}
                      <td>
                        <div className="d-flex align-items-center">
                          <i
                            className={`fa fa-circle me-1 ${emp.status == 1
                                ? "text-success"
                                : "text-danger"
                              }`}
                          ></i>
                          {emp.status == 1 ? "Active" : "Inactive"}
                        </div>
                      </td>

                      {/* ✅ ACTION */}
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

            {/* ✅ PAGINATION */}
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