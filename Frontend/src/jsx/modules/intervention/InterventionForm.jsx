import React, { useState } from "react";
import PageTitle from "../../layouts/PageTitle";

const InterventionForm = () => {

  const [formData, setFormData] = useState({
    intervention: "",
    amount: "",
    status: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <PageTitle activeMenu="Intervention Form" motherMenu="Intervention" />

      <div className="row">
        <div className="col-xl-12">
          <div className="card">

            <div className="card-header">
              <h4 className="card-title">Add Intervention</h4>
            </div>

            <div className="card-body">

              <form onSubmit={handleSubmit}>
                <div className="row">

                  {/* Intervention */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Intervention</label>
                    <input
                      type="text"
                      className="form-control"
                      name="intervention"
                      placeholder="Enter Intervention"
                      onChange={handleChange}
                    />
                  </div>

                  {/* Amount */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      placeholder="Enter Amount"
                      onChange={handleChange}
                    />
                  </div>

                  {/* Status */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      name="status"
                      onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                </div>

                <div className="text-end mt-3">
                  <button className="btn btn-primary">
                    Save Intervention
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