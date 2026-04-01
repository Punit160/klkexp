import React, { useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { getRoles, updateRole } from "./roleApi";

const RoleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchRole();
  }, []);

  const fetchRole = async () => {
    const res = await getRoles();
    const role = res.data.find((r) => r.id === Number(id));

    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateRole(id, formData);

    alert("Role updated");
    navigate("/role-list");
  };

  return (
    <>
      <PageTitle activeMenu="Edit Role" motherMenu="Role Management" />

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-2"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <textarea
              className="form-control"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <button className="btn btn-primary mt-3">
              Update Role
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RoleEdit;