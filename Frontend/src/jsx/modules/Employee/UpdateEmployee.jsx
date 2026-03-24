import React, { useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeById, updateEmployee } from "../APIS/employeeApi";

const UpdateEmployee = () => {
  const { id } = useParams();
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

  useEffect(() => {
    fetchEmployee();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEmployee = async () => {
    try {
      const data = await getEmployeeById(id);

      setFormData({
        empName: data.username || "",
        empEmail: data.email || "",
        password: "",
        reportingHead: data.reporting_head || "",
        doj: data.doj ? data.doj.split("T")[0] : "",
        dol: data.dol ? data.dol.split("T")[0] : "",
        ctc: data.ctc || "",
        phone: data.phone_no || "",
        designation: data.designation || "",
        dob: data.dob ? data.dob.split("T")[0] : "",
        gender: data.gender || "",
        qualification: data.qualification || "",
        status: data.status === 1 ? "Active" : "Inactive",
        photo: null,
      });

      if (data.user_img) {
        setPreview(`http://localhost:5001/uploads/${data.user_img}`);
      }

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Failed to fetch employee");
    }
  };

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

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true); //  loading true karo

  try {
    await updateEmployee(id, formData);
    alert("Employee updated successfully");

    navigate("/employee-List", {
      state: { updated: true }, //  list auto-refresh trigger
    });

  } catch (error) {
    console.error(error);
    alert("Update failed ❌");
  } finally {
    setLoading(false); //  loading false karo
  }
};

  return (
    <>
      <PageTitle activeMenu="Update Employee" motherMenu="Employee" />

      <div className="container-fluid">
        <div className="card shadow-sm">
          <div className="card-header">
            <h4 className="card-title">Update Employee</h4>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">

                <div className="col-md-6 mb-3">
                  <label>Employee Name *</label>
                  <input type="text" className="form-control"
                    name="empName"
                    value={formData.empName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Email *</label>
                  <input type="email" className="form-control"
                    name="empEmail"
                    value={formData.empEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Password</label>
                  <input type="password" className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Reporting Head</label>
                  <input type="text" className="form-control"
                    name="reportingHead"
                    value={formData.reportingHead}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Joining Date</label>
                  <input type="date" className="form-control"
                    name="doj"
                    value={formData.doj}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Leaving Date</label>
                  <input type="date" className="form-control"
                    name="dol"
                    value={formData.dol}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>CTC</label>
                  <input type="number" className="form-control"
                    name="ctc"
                    value={formData.ctc}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Phone</label>
                  <input type="text" className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Designation</label>
                  <input type="text" className="form-control"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Date of Birth</label>
                  <input type="date" className="form-control"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Gender</label>
                  <select className="form-control"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Qualification</label>
                  <input type="text" className="form-control"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Photo</label>
                  <input type="file" className="form-control"
                   name="photo"
                    onChange={handleChange}
                  />
                  {preview && (
                    <img src={preview} alt="preview"
                      style={{ width: "100px", marginTop: "10px" }}
                    />
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Status</label>
                  <select className="form-control"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="text-end mt-3">
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "Updating..." : "Update Employee"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateEmployee;