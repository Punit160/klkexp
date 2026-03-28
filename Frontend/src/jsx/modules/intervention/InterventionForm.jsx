import React, { useState, useEffect } from "react";
import PageTitle from "../../layouts/PageTitle";
import { useSearchParams, useNavigate } from "react-router-dom"; 

const InterventionForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    name: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setEditingId(parseInt(id));
      setIsEditMode(true);
      fetchIntervention(parseInt(id));
    }
  }, [searchParams]);

  const fetchIntervention = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}interventions/fetch-intervention/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Intervention not found");
        return;
      }

      setFormData({
        name: data.name,
        status: data.status ? "1" : "0",
      });
    } catch (error) {
      console.error(error);
      alert("Error fetching intervention");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.status === "") {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.name,
        status: formData.status == "1",
      };

      let url, method;

      if (isEditMode && editingId) {
        url = `${import.meta.env.VITE_BACKEND_API_URL}interventions/fetch-intervention/${editingId}`;
        method = "PUT";
      } else {
        url = `${import.meta.env.VITE_BACKEND_API_URL}interventions/create-intervention`;
        method = "POST";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      const message = isEditMode
        ? "Intervention updated successfully "
        : "Intervention created successfully ";

      alert(message);

      setFormData({
        name: "",
        status: "",
      });
      setEditingId(null);
      setIsEditMode(false);

      
      navigate("/intervention-list"); 

    } catch (error) {
      console.error(error);
      alert(`Error ${isEditMode ? "updating" : "creating"} intervention`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/intervention-list");
  };

  return (
    <>
      <PageTitle
        activeMenu={isEditMode ? "Edit Intervention" : "Intervention Form"}
        motherMenu="Intervention"
      />

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {isEditMode ? "Edit Intervention" : "Add Intervention"}
              </h4>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Intervention</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      placeholder="Enter Intervention"
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Select Status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="text-end mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleCancel} 
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : (isEditMode ? "Update Intervention" : "Save Intervention")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterventionForm;