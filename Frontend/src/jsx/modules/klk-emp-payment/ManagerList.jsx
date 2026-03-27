import React, { useState, useEffect } from "react";
import { Table, Card, Col, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import PageTitle from "../../layouts/PageTitle";

const ManagerList = () => {
  const [data, setData] = useState([]);
  const [reviewers, setReviewers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [reviewData, setReviewData] = useState({
    managerApproval: "1", 
    remark: "",
  });

 const [assignData, setAssignData] = useState({
    reviewer_id: "",
    managertoreviewer: "",
    });

  // ✅ FETCH DATA
  useEffect(() => {
    fetchExpenses();
    fetchReviewers();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}expense/manager-expenses`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ FETCH REVIEWERS
  const fetchReviewers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}expense/reviewers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReviewers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ OPEN REVIEW MODAL
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // ✅ OPEN ASSIGN MODAL
  const handleAssign = (item) => {
    setSelectedItem(item);
    setShowAssignModal(true);
  };

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

    const handleAssignChange = (e) => {
    const { name, value } = e.target;
    setAssignData({ ...assignData, [name]: value });
    };

  // ✅ SUBMIT APPROVAL
  const handleSubmit = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_API_URL}expense/manager-approve/${selectedItem.id}`,
        {
          approval_status: reviewData.managerApproval === "1",
          manager_remarks: reviewData.remark,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setShowModal(false);
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ ASSIGN REVIEWER API
 const handleAssignSubmit = async () => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_BACKEND_API_URL}expense/assign-reviewer/${selectedItem.id}`,
      {
        reviewer_id: Number(assignData.reviewer_id),
        managertoreviewer: assignData.managertoreviewer,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("✅ Reviewer assigned successfully");
    setShowAssignModal(false);
    setAssignData({
      reviewer_id: "",
      managertoreviewer: "",
    });

    fetchExpenses(); // refresh table

  } catch (error) {
    console.error(error);
  }
};

  return (
    <>
      <PageTitle activeMenu="Manager Panel" motherMenu="Payment" />

      <Col lg={12}>
        <Card>
          <Card.Header>
            <Card.Title>Manager Approval</Card.Title>
          </Card.Header>

          <Card.Body>
            <Table responsive className="text-nowrap">
              <thead>
                <tr>
                  <th>Sno</th>
                  <th>Project</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Village</th>
                  <th>Amount</th>
                  <th>Reviewer</th>
                  <th>Reviewer Detail</th>
                  <th>Manager Approval</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.project}</td>
                      <td>{item.state}</td>
                      <td>{item.district}</td>
                      <td>{item.village}</td>
                      <td>₹ {item.amount}</td>

                      
                      {/* ASSIGN */}

                      <td>
                    <button
                        className={`btn btn-xs ${
                        item.review_assign ? "btn-success" : "btn-warning"
                        }`}
                        onClick={() => !item.review_assign && handleAssign(item)}
                        disabled={!!item.review_assign}
                    >
                        {item.review_assign ? "Assigned" : "Pending"}
                    </button>
                    </td>

                     <td>
                      <b> Reviewer : </b> {item.reviewer_name} <br></br>
                      <b> Manager to Reviewer : </b> {item.managertoreviewer} 
                    </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`badge ${
                            item.status === "Approved"
                              ? "bg-success"
                              : item.status === "Rejected"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>


                      {/* APPROVAL */}

                      <td>
                        <Button
                          size="sm"
                          onClick={() => handleOpenModal(item)}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>

      {/* REVIEW MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Manager Review</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Select
              name="managerApproval"
              value={reviewData.managerApproval}
              onChange={handleChange}
            >
              <option value="1">Approved</option>
              <option value="0">Rejected</option>
            </Form.Select>

            <Form.Control
              as="textarea"
              className="mt-3"
              name="remark"
              placeholder="Enter remark"
              onChange={handleChange}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>

      {/* ASSIGN MODAL */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Reviewer</Modal.Title>
        </Modal.Header>

        <Modal.Body>
     <Form>
  <Form.Select
    name="reviewer_id"
    value={assignData.reviewer_id}
    onChange={handleAssignChange}
  >
    <option value="">Select Reviewer</option>
    {reviewers.map((r) => (
      <option key={r.id} value={r.id}>
        {r.username} ({r.email})
      </option>
    ))}
  </Form.Select>

  <Form.Control
    as="textarea"
    className="mt-3"
    name="managertoreviewer"
    value={assignData.managertoreviewer}
    placeholder="Enter remark"
    onChange={handleAssignChange}
  />
</Form>

        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => setShowAssignModal(false)}>Cancel</Button>
          <Button onClick={handleAssignSubmit}>Assign</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManagerList;