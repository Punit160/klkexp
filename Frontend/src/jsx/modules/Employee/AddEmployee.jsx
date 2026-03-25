import React, { useState } from "react";
import { Col, Card } from "react-bootstrap"; // Make sure react-bootstrap is installed

import PageTitle from "../../layouts/PageTitle";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "./APIS"; 

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.empName || !formData.empEmail || !formData.password) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          // Map phone field correctly
          if (key === "phone") data.append("phone_no", value);
          else data.append(key, value);
        }
      });

      const { ok, result } = await createEmployee(data);

      if (ok) {
        alert("Employee added successfully");
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
        navigate("/employee-List");
      } else {
        alert(result.message || "Error occurred");
      }
    } catch (error) {
      console.log("FULL ERROR:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
     <>
      <PageTitle activeMenu="Add Employee" motherMenu="Employee" />

      <Col lg={12}>
        <Card>
          <Card.Header>
            <Card.Title>Add Employee</Card.Title>
          </Card.Header>

          <Card.Body>
            <form onSubmit={handleSubmit}>
              <div className="row">

                {/* Employee Name */}
                <div className="col-lg-6 mb-3">
                  <label>Employee Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="empName"
                    value={formData.empName}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="col-lg-6 mb-3">
                  <label>Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="empEmail"
                    value={formData.empEmail}
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div className="col-lg-6 mb-3">
                  <label>Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                {/* Reporting Head */}
                <div className="col-lg-6 mb-3">
                  <label>Reporting Head</label>
                  <input
                    type="text"
                    className="form-control"
                    name="reportingHead"
                    value={formData.reportingHead}
                    onChange={handleChange}
                  />
                </div>

                {/* Joining Date */}
                <div className="col-lg-6 mb-3">
                  <label>Joining Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="doj"
                    value={formData.doj}
                    onChange={handleChange}
                  />
                </div>

                {/* Leaving Date */}
                <div className="col-lg-6 mb-3">
                  <label>Leaving Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dol"
                    value={formData.dol}
                    onChange={handleChange}
                  />
                </div>

                {/* CTC */}
                <div className="col-lg-6 mb-3">
                  <label>CTC</label>
                  <input
                    type="number"
                    className="form-control"
                    name="ctc"
                    value={formData.ctc}
                    onChange={handleChange}
                  />
                </div>

                {/* Phone */}
                <div className="col-lg-6 mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Designation */}
                <div className="col-lg-6 mb-3">
                  <label>Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                {/* Gender */}
                <div className="col-lg-6 mb-3">
                  <label>Gender</label>
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

                {/* Status */}
                <div className="col-lg-6 mb-3">
                  <label>Status</label>
                  <select
                    className="form-control"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Photo */}
                <div className="col-lg-6 mb-3">
                  <label>Photo</label>
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

              </div>

              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !formData.empName || !formData.empEmail || !formData.password}
                >
                  {loading ? "Saving..." : "Save Employee"}
                </button>
              </div>

            </form>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default AddEmployee;