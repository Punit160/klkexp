import React, { useState, useEffect } from "react";
import PageTitle from "../../layouts/PageTitle";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, updateProject } from "./projectApi";

const ProjectFormUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    project_name: "",
    start_date: "",
    end_date: "",
    financial_year: "",
    funder_name: "",
    contact_person: "",
    contact_person_number: "",
    mou: null,
     existingMou: "",
    manager_id: "",
    description: "",
    projectStatus: "",
  });

  /* ================= FETCH PROJECT BY ID ================= */
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        // Backend direct object return karta hai (no wrapper)
        const proj = await getProjectById(id);

        if (!proj || !proj.id) {
          alert("Failed to fetch project");
          return;
        }

        setFormData({
          project_name: proj.name || "",
          start_date: proj.start_date?.split("T")[0] || "",
          end_date: proj.end_date?.split("T")[0] || "",
          financial_year: proj.financial_year || "",
          funder_name: proj.funder_name || "",
          contact_person: proj.contact_person || "",
          contact_person_number: proj.contact_person_number || "",
          mou: null,
          existingMou: proj.mou || "",
          manager_id: proj.manager_id || "",
          description: proj.description || "",
          projectStatus: proj.status ? "Ongoing" : "Completed",
        });

      } catch (err) {
        console.error(err);
        alert("Error loading project");
      }
    };

    fetchProject();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "mou") {
      setFormData({ ...formData, mou: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* ================= UPDATE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      form.append("name", formData.project_name);
      form.append("start_date", formData.start_date);
      form.append("end_date", formData.end_date);
      form.append("financial_year", formData.financial_year);
      form.append("funder_name", formData.funder_name);
      form.append("contact_person", formData.contact_person);
      form.append("contact_person_number", formData.contact_person_number);
      form.append("manager_id", formData.manager_id);
      form.append("description", formData.description);
      form.append("status", formData.projectStatus === "Ongoing" ? "true" : "false");

      if (formData.mou) {
        form.append("mou", formData.mou);
      }

      const data = await updateProject(id, form);

      // Backend success === false hone par hi error dikhao
      if (data?.success === false) {
        alert(data.message || "Update failed");
        return;
      }

      alert("Project Updated Successfully");
      navigate("/project-list");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <PageTitle activeMenu="Update Project" motherMenu="Project Master" />

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Project Name</label>
                <input
                  type="text"
                  name="project_name"
                  className="form-control"
                  value={formData.project_name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  className="form-control"
                  value={formData.start_date}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  className="form-control"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Financial Year</label>
                <input
                  type="text"
                  name="financial_year"
                  className="form-control"
                  value={formData.financial_year}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Funder Name</label>
                <input
                  type="text"
                  name="funder_name"
                  className="form-control"
                  value={formData.funder_name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Contact Person</label>
                <input
                  type="text"
                  name="contact_person"
                  className="form-control"
                  value={formData.contact_person}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contact_person_number"
                  className="form-control"
                  value={formData.contact_person_number}
                  onChange={handleChange}
                />
              </div>
<div className="col-md-6 mb-3">
  <label>Upload New MOU (optional)</label>
  <input
    type="file"
    name="mou"
    className="form-control"
    onChange={handleChange}
  />
  {/*  Purana MOU dikh raha hai user ko */}
  {formData.existingMou && !formData.mou && (
    <small className="text-muted mt-1 d-block">
      Current MOU:{" "}
      <a href={formData.existingMou} target="_blank" rel="noopener noreferrer">
        View Existing File
      </a>
    </small>
  )}
  {formData.mou && (
    <small className="text-success mt-1 d-block">
      ew file selected: {formData.mou.name}
    </small>
  )}
</div>

              <div className="col-md-6 mb-3">
                <label>Manager ID</label>
                <input
                  type="text"
                  name="manager_id"
                  className="form-control"
                  value={formData.manager_id}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select
                  name="projectStatus"
                  className="form-control"
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
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={150}
                />
              </div>

            </div>

            <div className="text-end mt-3">
              <button type="submit" className="btn btn-primary">
                Update Project
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default ProjectFormUpdate;