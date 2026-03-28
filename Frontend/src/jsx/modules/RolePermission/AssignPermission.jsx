import { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";

const modules = [
  "Solar Panel",
  "Tracking System",
  "Battery",
  "Dispatch",
  "Users",
];

const PermissionPopup = ({ show, onClose, role }) => {
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const initial = {};
    modules.forEach((m) => {
      initial[m] = {
        view: false,
        add: false,
        edit: false,
        delete: false,
      };
    });
    setPermissions(initial);
  }, [role]);

  // Toggle single permission
  const toggle = (module, perm) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [perm]: !prev[module][perm],
      },
    }));
  };

  // Toggle all permissions
  const toggleAll = (module) => {
    const allChecked = Object.values(permissions[module]).every((v) => v);
    const updated = {};
    Object.keys(permissions[module]).forEach((k) => {
      updated[k] = !allChecked;
    });
    setPermissions((prev) => ({
      ...prev,
      [module]: updated,
    }));
  };

  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          Role Permission : <strong>{role?.name}</strong>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Table responsive hover bordered className="text-nowrap align-middle">
          <thead className="table-light">
            <tr>
              <th>Module</th>
              <th className="text-center">All</th>
              <th className="text-center">View</th>
              <th className="text-center">Add</th>
              <th className="text-center">Edit</th>
              <th className="text-center">Delete</th>
            </tr>
          </thead>

          <tbody>
            {modules.map((module) => (
              <tr key={module}>
                <td>{module}</td>

                {/* ALL */}
                <td className="text-center">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={
                      permissions[module] &&
                      Object.values(permissions[module]).every((v) => v)
                    }
                    onChange={() => toggleAll(module)}
                  />
                </td>

                {/* INDIVIDUAL */}
                {["view", "add", "edit", "delete"].map((perm) => (
                  <td key={perm} className="text-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={permissions[module]?.[perm] || false}
                      onChange={() => toggle(module, perm)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="success"
          onClick={() => {
            console.log("Saved Permissions:", permissions);
            onClose();
          }}
        >
          Save Permissions
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PermissionPopup;