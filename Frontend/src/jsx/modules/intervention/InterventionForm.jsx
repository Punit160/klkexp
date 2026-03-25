import React, { useState } from "react";
import PageTitle from "../../layouts/PageTitle";

const InterventionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Submit form
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
        status: formData.status == 1, // ✅ convert to boolean
      };

      const res = await fetch(
         `${import.meta.env.VITE_BACKEND_API_URL}interventions/create-intervention`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ JWT
          },
          body: JSON.stringify(payload),
        }
      );
      
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert("Intervention created successfully ✅");

      // ✅ Reset form
      setFormData({
        name: "",
        status: "",
      });

    } catch (error) {
      console.error(error);
      alert("Error creating intervention");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle
        activeMenu="Intervention Form"
        motherMenu="Intervention"
      />

      <div className="row">
        <div className="col-xl-12">
          <div className="card">

            <div className="card-header">
              <h4 className="card-title">Add Intervention</h4>
            </div>

            <div className="card-body">

              <form onSubmit={handleSubmit}>
                <div className="row">

                  {/* Intervention Name */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Intervention</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      placeholder="Enter Intervention"
                      onChange={handleChange}
                    />
                  </div>

                  {/* Status */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                </div>

                {/* Submit Button */}
                <div className="text-end mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Intervention"}
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