import React, { useState, useEffect } from "react";
import { Col, Card, Table } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";

const ProjectMasterList = () => {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  /* PAGINATION */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  /* FETCH PROJECTS */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log(import.meta.env.VITE_BACKEND_API_URL);

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}projects/get-projects`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include", 
          }
        );

        const data = await response.json();

        console.log("API RESPONSE:", data);

        if (!response.ok) {
          console.error(data.message);
          return;
        }

        // ✅ Map backend data to UI format
      const formattedData = (data.data || []).map((proj) => ({
            id: proj.id,
            projectName: proj.name, // ✅ FIXED
            startDate: proj.start_date
                ? new Date(proj.start_date).toLocaleDateString()
                : "-",
            endDate: proj.end_date
                ? new Date(proj.end_date).toLocaleDateString()
                : "-",
            financialYear: proj.financial_year,
            funderName: proj.funder_name,
            contactPerson: proj.contact_person_number,
            contactPersonName: proj.contact_person,
            projectManager: proj.manager_id,

            // ✅ FIXED (status is boolean)
            projectStatus: proj.status
                ? "Ongoing"
                : "Completed",

            mou: proj.mou,
            }));

        setProjects(formattedData);

      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const currentProjects = projects.slice(indexOfFirst, indexOfLast);

  const columns = [
    { label: "Project Name", key: "projectName" },
    { label: "Start Date", key: "startDate" },
    { label: "End Date", key: "endDate" },
    { label: "Financial Year", key: "financialYear" },
    { label: "Funder Name", key: "funderName" },
    { label: "Contact Person", key: "contactPerson" },
    { label: "Contact Person Name", key: "contactPersonName" },
    { label: "Project Manager", key: "projectManager" },
    { label: "Status", key: "projectStatus" },
  ];

  /* LOADING UI */
  if (loading) {
    return (
      <>
        <PageTitle activeMenu="Project Master List" motherMenu="Project Master" />
        <div className="text-center mt-5">Loading projects...</div>
      </>
    );
  }

  return (
    <>
      <PageTitle activeMenu="Project Master List" motherMenu="Project Master" />

      <Col lg={12}>
        <Card>

          <Card.Header className="d-flex justify-content-between">
            <Card.Title>Project Master List</Card.Title>

            <TableExportActions
              data={projects}
              columns={columns}
              fileName="Project_Master_List"
            />
          </Card.Header>

          <Card.Body>

            <Table responsive className="text-nowrap">

              <thead>
                <tr>
                  <th>Sno</th>
                  <th>Project Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Financial Year</th>
                  <th>Funder</th>
                  <th>Contact</th>
                  <th>Contact Name</th>
                  <th>MOU</th>
                  <th>Manager</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {currentProjects.length > 0 ? (
                  currentProjects.map((proj, index) => (
                    <tr key={proj.id}>

                      <td>{indexOfFirst + index + 1}</td>

                      <td>{proj.projectName}</td>
                      <td>{proj.startDate}</td>
                      <td>{proj.endDate}</td>
                      <td>{proj.financialYear}</td>
                      <td>{proj.funderName}</td>
                      <td>{proj.contactPerson}</td>
                      <td>{proj.contactPersonName}</td>

                      {/* MOU VIEW */}
                      <td>
                        {proj.mou ? (
                          <a
                            href={proj.mou}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-info"
                          >
                            View
                          </a>
                        ) : (
                          <span>No File</span>
                        )}
                      </td>

                      <td>{proj.projectManager}</td>

                      {/* STATUS */}
                      <td>
                        <div className="d-flex align-items-center">
                          <i
                            className={`fa fa-circle me-1 ${
                              proj.projectStatus === "Ongoing"
                                ? "text-primary"
                                : proj.projectStatus === "Completed"
                                ? "text-success"
                                : "text-warning"
                            }`}
                          ></i>
                          {proj.projectStatus}
                        </div>
                      </td>

                      {/* ACTION */}
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
                    <td colSpan="12" className="text-center">
                      No Projects Found
                    </td>
                  </tr>
                )}

              </tbody>

            </Table>

            <Pagination
              totalItems={projects.length}
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

export default ProjectMasterList;