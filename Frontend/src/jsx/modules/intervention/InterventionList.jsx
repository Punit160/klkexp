import React, { useEffect, useState } from "react";
import { Col, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";

const InterventionList = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(false);

  /* PAGINATION */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = interventions.slice(indexOfFirst, indexOfLast);

  // FETCH DATA
  const fetchInterventions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}interventions/get-interventions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setInterventions(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // DELETE (Fixed URL)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this intervention?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}interventions/delete-intervention/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Deleted successfully ");
      fetchInterventions(); 
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, []);

  const columns = [
    { label: "Intervention", key: "name" },
    { label: "Status", key: "status" },
  ];

  return (
    <>
      <PageTitle activeMenu="Intervention List" motherMenu="Intervention" />

      <Col lg={12}>
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <Card.Title>Intervention List</Card.Title>
            <div>
              <TableExportActions
                data={interventions}
                columns={columns}
                fileName="Intervention_List"
              />
            </div>
          </Card.Header>

          <Card.Body>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : interventions.length === 0 ? (
              <p className="text-center text-muted">No interventions found</p>
            ) : (
              <Table responsive className="text-nowrap">
                <thead>
                  <tr>
                    <th>Sno</th>
                    <th>Intervention</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i
                            className={`fa fa-circle me-1 ${item.status ? "text-success" : "text-danger"
                              }`}
                          ></i>
                          {item.status ? "Active" : "Inactive"}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                        
                          <Link
                            to={`/intervention-form?id=${item.id}`}  
                            className="btn btn-primary shadow btn-xs sharp"
                            title="Edit"
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </Link>

                          {/* DELETE */}
                          <button
                            className="btn btn-danger shadow btn-xs sharp"
                            onClick={() => handleDelete(item.id)}
                            title="Delete"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <Pagination
              totalItems={interventions.length}
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

export default InterventionList;