import React, { useState } from "react";
import PageTitle from "../../layouts/PageTitle";

const ProjectMasterForm = () => {

  const [formData, setFormData] = useState({
    projectName: "",
    alloyNumber: "",
    startDate: "",
    endDate: "",
    financialYear: "",
    funderName: "",
    contactPerson: "",
    contactPersonName: "",
    mou: null,
    projectManager: "",
    projectStatus: ""
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "mou") {
      setFormData({ ...formData, mou: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <PageTitle activeMenu="Project Master Form" motherMenu="Project Master" />

      <div className="row">
        <div className="col-xl-12">
          <div className="card">

            <div className="card-header">
              <h4 className="card-title">Add Project</h4>
            </div>

            <div className="card-body">

              <form onSubmit={handleSubmit}>
                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Project Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="projectName"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Alloy Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="alloyNumber"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startDate"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="endDate"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Financial Year</label>
                    <input
                      type="text"
                      className="form-control"
                      name="financialYear"
                      placeholder="2025-2026"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Funder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="funderName"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contact Person</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contactPerson"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contact Person Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contactPersonName"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Upload MOU</label>
                    <input
                      type="file"
                      className="form-control"
                      name="mou"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Project Manager</label>
                    <input
                      type="text"
                      className="form-control"
                      name="projectManager"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Project Status</label>
                    <select
                      className="form-control"
                      name="projectStatus"
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>

                </div>

                <div className="text-end mt-3">
                  <button className="btn btn-primary">
                    Save Project
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

export default ProjectMasterForm;