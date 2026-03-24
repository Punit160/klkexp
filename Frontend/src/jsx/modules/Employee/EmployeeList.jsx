import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Card, Table } from "react-bootstrap";
import avatar1 from "../../../assets/images/User.jpg";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";

const EmployeeList = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 FETCH API
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}users/get-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User API:", res.data);

      // ⚠️ Adjust according to your API response
      setData(res.data.data || res.data || []);

    } catch (error) {
      console.log("User API Error", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔥 PAGINATION
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentEmployees = data.slice(indexOfFirst, indexOfLast);

  // 🔥 LOADING / ERROR UI
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
                { label: "Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" },
                { label: "Designation", key: "designation" },
                { label: "Status", key: "status" }
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
                    <tr key={emp.id || index}>

                      <td>{indexOfFirst + index + 1}</td>

                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={emp.photo || avatar1}
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
                            className={`fa fa-circle me-1 ${
                              emp.status == "1"
                                ? "text-success"
                                : "text-danger"
                            }`}
                          ></i>
                          {emp.status || "Inactive"}
                        </div>
                      </td>

                      <td>
                        <div className="d-flex">
                          <button className="btn btn-primary shadow btn-xs sharp me-1">
                            <i className="fas fa-pencil-alt"></i>
                          </button>

                          <button className="btn btn-danger shadow btn-xs sharp">
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
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