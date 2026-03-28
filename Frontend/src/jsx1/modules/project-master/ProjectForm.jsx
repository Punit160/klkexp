import React, { useState } from "react";
import PageTitle from "../../layouts/PageTitle";

const ProjectMasterForm = () => {

  const [formData, setFormData] = useState({
    project_name: "",
    start_date: "",
    end_date: "",
    financial_year: "",
    funder_name: "",
    contact_person: "",
    contact_person_number: "",
    mou: null,
    manager_id: "",
    description:"",
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

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const form = new FormData();

    form.append("project_name", formData.project_name);
    form.append("start_date", formData.start_date);
    form.append("end_date", formData.end_date);
    form.append("financial_year", formData.financial_year);
    form.append("funder_name", formData.funder_name);
    form.append("contact_person", formData.contact_person);
    form.append("contact_person_number", formData.contact_person_number);
    form.append("manager_id", formData.manager_id);
    form.append("description", formData.description);

    // ✅ convert status to backend boolean (1/0)
    form.append("projectStatus", formData.projectStatus === "Ongoing" ? 1 : 0);

    // 📄 file
    if (formData.mou) {
      form.append("mou", formData.mou);
    }

      const token = localStorage.getItem("token");
      
      console.log("TOKEN:", token);
    
      const response = await fetch(
  
        `${import.meta.env.VITE_BACKEND_API_URL}projects/create-project`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

    

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    alert("Project created successfully ✅");

    console.log(data);

  } catch (error) {
    console.error(error);
    alert("Error creating project");
  }
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
                      name="project_name"
                      value={formData.project_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Financial Year</label>
                    <input
                      type="text"
                      className="form-control"
                      name="financial_year"
                      value={formData.financial_year}
                      placeholder="2025-2026"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Funder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="funder_name"
                      value={formData.funder_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contact Person</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contact Person Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contact_person_number"
                      value={formData.contact_person_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Upload MOU</label>
                    <input
                      type="file"
                      className="form-control"
                      name="mou"
                      value={formData.contact_personmou_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Project Manager</label>
                    <input
                      type="text"
                      className="form-control"
                      name="manager_id"
                      value={formData.manager_id}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Project Status</label>
                    <select
                      className="form-control"
                      name="projectStatus"
                      value={formData.projectStatus}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>

                  <div className="col-md-12 mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4} 
                    maxLength={150}
                  ></textarea>
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