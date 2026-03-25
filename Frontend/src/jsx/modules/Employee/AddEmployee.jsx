import React, { useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    empName: "",
    empEmail: "",
    password: "",
    reportingHead: "",
    doj: "",
    dol: "",
    ctc: "",
    phone: "",
    designation: "",
    dob: "",
    gender: "",
    qualification: "",
    status: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.empName || !formData.empEmail || !formData.password) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // ✅ FIELD MAPPING (IMPORTANT)
      data.append("empName", formData.empName);
      data.append("empEmail", formData.empEmail);
      data.append("password", formData.password);
      data.append("reportingHead", formData.reportingHead);
      data.append("doj", formData.doj);
      data.append("dol", formData.dol);
      data.append("ctc", formData.ctc);
      data.append("phone", formData.phone);
      data.append("designation", formData.designation);
      data.append("dob", formData.dob);
      data.append("gender", formData.gender);
      data.append("qualification", formData.qualification);
      data.append("status", formData.status);

      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      const token = localStorage.getItem("token");
      
      console.log("TOKEN:", token);

      const response = await fetch(
  
        `${import.meta.env.VITE_BACKEND_API_URL}users/create-user`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Employee added successfully ✅");

        // Reset form
        setFormData({
          empName: "",
          empEmail: "",
          password: "",
          reportingHead: "",
          doj: "",
          dol: "",
          ctc: "",
          phone: "",
          designation: "",
          dob: "",
          gender: "",
          qualification: "",
          status: "",
          photo: null,
        });

        setPreview(null);

        // ✅ Redirect
        navigate("/employee-List");
      } else {
        alert(result.message || "Error occurred ❌");
      }
    } catch (error) {
  console.log("FULL ERROR:", error);
  alert({message : error.message});
} finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle activeMenu="Add Employee" motherMenu="Employee" />

      <div className="container-fluid">
        <div className="card shadow-sm">
          <div className="card-header">
            <h4 className="card-title">Add Employee</h4>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">

                {/* Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Employee Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="empName"
                    value={formData.empName}
                    onChange={handleChange}
                    placeholder="Enter employee name"
                  />
                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="empEmail"
                    value={formData.empEmail}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>

                {/* Password */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                </div>

                {/* Reporting Head */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Reporting Head</label>
                  <input
                    type="text"
                    className="form-control"
                    name="reportingHead"
                    value={formData.reportingHead}
                    onChange={handleChange}
                  />
                </div>

                {/* Joining Date */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Joining Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="doj"
                    value={formData.doj}
                    onChange={handleChange}
                  />
                </div>

                {/* Leaving Date */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Leaving Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dol"
                    value={formData.dol}
                    onChange={handleChange}
                  />
                </div>

                {/* CTC */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">CTC</label>
                  <input
                    type="number"
                    className="form-control"
                    name="ctc"
                    value={formData.ctc}
                    onChange={handleChange}
                  />
                </div>

                {/* Phone */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Designation */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                {/* DOB */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                {/* Gender */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-control"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Qualification */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Qualification</label>
                  <input
                    type="text"
                    className="form-control"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                </div>

                {/* Photo */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Photo</label>
                  <input
                    type="file"
                    className="form-control"
                    name="photo"
                    onChange={handleChange}
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      style={{ width: "100px", marginTop: "10px" }}
                    />
                  )}
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
                    <option value="">Select</option>
                    <option value="0">Active</option>
                    <option value="1">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="text-end mt-3">
                <button
                  className="btn btn-primary"
                  disabled={
                    loading ||
                    !formData.empName ||
                    !formData.empEmail ||
                    !formData.password
                  }
                >
                  {loading ? "Saving..." : "Save Employee"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEmployee;