import React, { useEffect, useState } from "react";
import { Col, Card, Table } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import TableExportActions from "../../components/Common/TableExportActions";
import Pagination from "../../components/Common/Pagination";
import { useNavigate, useLocation } from "react-router-dom";
import { getRoles, deleteRole } from "./roleApi";

const RoleList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* PAGINATION */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  /* ================= FETCH ROLES ================= */
  useEffect(() => {
    fetchRoles();
  }, [location.key]);

  const fetchRoles = async () => {
    try {
      const res = await getRoles();

      if (!res || !res.data) {
        console.error("Failed to fetch roles");
        return;
      }

      const formatted = res.data.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description || "-",
        permissions: role.permissions || [],
        created_at: role.created_at,
      }));

      setRoles(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    setRoles((prev) => prev.filter((r) => r.id !== id));

    try {
      const res = await deleteRole(id);

      if (res && res.success === false) {
        alert(res.message || "Delete failed");
        fetchRoles();
      }
    } catch (error) {
      console.error(error);
      fetchRoles();
    }
  };

  const currentRoles = roles.slice(indexOfFirst, indexOfLast);

  const columns = [
    { label: "Role Name", key: "name" },
    { label: "Description", key: "description" },
    { label: "Permissions", key: "permissions" },
    { label: "Created At", key: "created_at" },
  ];

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        <PageTitle activeMenu="Role List" motherMenu="Role Management" />
        <div className="text-center mt-5">Loading roles...</div>
      </>
    );
  }

  return (
    <>
      <PageTitle activeMenu="Role List" motherMenu="Role Management" />

      <Col lg={12}>
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <Card.Title>Role List</Card.Title>

            <TableExportActions
              data={roles}
              columns={columns}
              fileName="Role_List"
            />
          </Card.Header>

          <Card.Body>
            <Table responsive className="text-nowrap">
              <thead>
                <tr>
                  <th>Sno</th>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentRoles.length > 0 ? (
                  currentRoles.map((role, index) => (
                    <tr key={role.id}>
                      <td>{indexOfFirst + index + 1}</td>

                      <td>{role.name}</td>

                      <td>{role.description}</td>

                      {/* CREATED DATE */}
                      <td>
                        {role.created_at
                          ? new Date(role.created_at).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* ACTION */}
                      <td>
                        <div className="d-flex">

                          {/* ASSIGN PERMISSION */}
                          <button
                            className="btn btn-success shadow btn-xs sharp me-1"
                            onClick={() =>
                              navigate(`/role/assign/${role.id}`)
                            }
                            title="Assign Permission"
                          >
                            <i className="fa fa-key"></i>
                          </button>

                          {/* EDIT */}
                          <button
                            className="btn btn-primary shadow btn-xs sharp me-1"
                            onClick={() =>
                              navigate(`/role/edit/${role.id}`)

                            }
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </button>

                          {/* DELETE */}
                          <button
                            className="btn btn-danger shadow btn-xs sharp"
                            onClick={() => handleDelete(role.id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No Roles Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            <Pagination
              totalItems={roles.length}
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

export default RoleList;