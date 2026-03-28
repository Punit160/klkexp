import React, { useState, useEffect } from "react";
import { Col, Card, Table } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllProjects, deleteProject ,getManagers} from "./projectApi";


const ProjectMasterList = () => {
  const navigate = useNavigate();
    const location = useLocation(); 

    const [managers, setManagers] = useState([]);



  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  /* PAGINATION */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;


  //  managers fetch 
useEffect(() => {
  const fetchManagers = async () => {
    const { ok, result } = await getManagers();
    if (ok) setManagers(result);
  };
  fetchManagers();
}, []);

//  Helper function 
const getManagerName = (managerId) => {
  const found = managers.find((m) => m.id === managerId || m.id === Number(managerId));
  return found ? found.username : managerId; // fallback: id dikhao
};

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    fetchProjects();
  }, [location.key]);

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();

      if (!data || !data.data) {
        console.error(data?.message || "Failed to fetch projects");
        return;
      }

      const formattedData = data.data.map((proj) => ({
        id: proj.id,
        projectName: proj.name,
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
        projectStatus: proj.status ? "Ongoing" : "Completed",
        mou: proj.mou,
        description: proj.description || "-",
      }));

      setProjects(formattedData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete?");
  if (!confirmDelete) return;

  // Pehle UI se remove karo (optimistic)
  setProjects((prev) => prev.filter((p) => p.id !== id));

  try {
    const data = await deleteProject(id);

    // Agar delete fail hua to wapas add karo
    if (data && data.success === false) {
      alert(data.message || "Delete failed");
      fetchProjects(); // revert
    }
  } catch (err) {
    console.error(err);
    alert("Error deleting project");
    fetchProjects(); // revert on error
  }
};

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

  /* ================= LOADING ================= */
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

                      {/* MOU */}
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

                      <td>{getManagerName(proj.projectManager)}</td>


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
                          {/* EDIT */}
                          <button
                            className="btn btn-primary shadow btn-xs sharp me-1"
                            onClick={() => navigate(`/project-edit/${proj.id}`)}
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </button>

                          {/* DELETE */}
                          <button
                            className="btn btn-danger shadow btn-xs sharp"
                            onClick={() => handleDelete(proj.id)}
                          >
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