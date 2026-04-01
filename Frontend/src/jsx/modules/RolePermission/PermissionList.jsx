import React, { useEffect, useState } from "react";
import { Col, Card, Table } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import Pagination from "../../components/Common/Pagination";
import { getPermissions, deletePermission } from "./permissionApi";

const PermissionList = () => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    const res = await getPermissions();
    setPermissions(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;

    await deletePermission(id);
    fetchPermissions();
  };

  return (
    <>
      <PageTitle activeMenu="Permission List" motherMenu="Permission Management" />

      <Col lg={12}>
        <Card>
          <Card.Header>
            <Card.Title>Permission List</Card.Title>
          </Card.Header>

          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Sno</th>
                  <th>Key</th>
                  <th>Label</th>
                  <th>Module</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {permissions.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.label}</td>
                    <td>{p.module}</td>

                    <td>
                      <button
                        className="btn btn-danger btn-xs"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default PermissionList;