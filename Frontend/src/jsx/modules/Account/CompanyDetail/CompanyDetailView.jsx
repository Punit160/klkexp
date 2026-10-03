import React from "react";
import { Badge, Card, Col, Row, Table } from "react-bootstrap";
import DocumentAttachments from "../vouchers/shared/DocumentAttachments";
import SourceBadge from "../SourceBadge";
import { ATTACHMENT_DOCUMENT_TYPES } from "../documentAttachmentApi";

const statusVariant = {
  Posted: "success",
  Draft: "warning",
  Cancelled: "danger",
};

const tallyVariant = {
  PUSHED: "success",
  FAILED: "danger",
  NOT_PUSHED: "secondary",
};

const show = (value) => {
  if (value === undefined || value === null || String(value).trim() === "") return "—";
  return String(value);
};

const Field = ({ label, value }) => (
  <Col md={4} className="mb-3">
    <div className="text-muted small">{label}</div>
    <div className="fw-medium">{show(value)}</div>
  </Col>
);

const CompanyDetailView = ({ data, onBack }) => {
  const banks = data?.bank_accounts || [];
  const address = [data?.add_line1 || data?.address, data?.add_line2, data?.add_line3]
    .filter((line) => line && String(line).trim())
    .join(", ");

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="d-flex flex-wrap align-items-center justify-content-between gap-3 bg-white py-3">
        <div className="d-flex align-items-center gap-3">
          <button type="button" className="btn btn-light" onClick={onBack} title="Back to list">
            <i className="fa fa-arrow-left"></i>
          </button>
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h5 className="mb-0 fw-bold">{data?.name || "Company"}</h5>
              <Badge bg={statusVariant[data?.status] || "secondary"} className="rounded-pill">
                {data?.status || "Draft"}
              </Badge>
              <Badge bg={Number(data?.record_status) === 0 ? "secondary" : "success"} className="rounded-pill">
                {Number(data?.record_status) === 0 ? "Inactive" : "Active"}
              </Badge>
              <Badge bg={tallyVariant[data?.tally_push_status] || "secondary"} className="rounded-pill">
                Tally: {data?.tallyLabel || "Not Pushed"}
              </Badge>
              <SourceBadge
                dataStatus={data?.data_status}
                label={data?.sourceLabel}
                variant={data?.sourceVariant}
              />
            </div>
            <small className="text-muted">
              {data?.ledger_name || data?.name || "—"} · {data?.code || "—"}
            </small>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <h6 className="text-uppercase small fw-bold text-primary mb-3">Company and ledger</h6>
        <Row>
          <Field label="Company Name" value={data?.name} />
          <Field label="Ledger Name" value={data?.ledger_name} />
          <Field label="Short Name" value={data?.short_name} />
          <Field label="Ledger Code" value={data?.code} />
          <Field label="Ledger Group" value={data?.ledger_group} />
          <Field label="Email" value={data?.email} />
        </Row>

        <h6 className="text-uppercase small fw-bold text-primary mb-3 mt-2">Tax and registration</h6>
        <Row>
          <Field label="GST Number" value={data?.gst} />
          <Field label="PAN" value={data?.pan} />
          <Field label="TAN" value={data?.tan} />
          <Field label="CIN" value={data?.cin} />
          <Field label="State Code" value={data?.state_code} />
        </Row>

        <h6 className="text-uppercase small fw-bold text-primary mb-3 mt-2">Address</h6>
        <Row>
          <Col md={12} className="mb-3">
            <div className="text-muted small">Full address</div>
            <div className="fw-medium">{address || "—"}</div>
          </Col>
          <Field label="Address line 1" value={data?.add_line1 || data?.address} />
          <Field label="Address line 2" value={data?.add_line2} />
          <Field label="Address line 3" value={data?.add_line3} />
          <Field label="City" value={data?.city} />
          <Field label="State" value={data?.state} />
          <Field label="Country" value={data?.country} />
          <Field label="PIN" value={data?.zipcode} />
        </Row>

        <h6 className="text-uppercase small fw-bold text-primary mb-3 mt-2">Contact</h6>
        <Row>
          <Field label="Contact Person" value={data?.contact_person} />
          <Field label="Contact Number" value={data?.contact_number} />
        </Row>

        <h6 className="text-uppercase small fw-bold text-primary mb-3 mt-2">Bank accounts</h6>
        {banks.length === 0 ? (
          <p className="text-muted">No bank accounts.</p>
        ) : (
          <Table bordered responsive className="align-middle mb-4">
            <thead>
              <tr>
                <th>Bank Name</th>
                <th>Account No</th>
                <th>Branch</th>
                <th>IFSC</th>
                <th>Primary</th>
              </tr>
            </thead>
            <tbody>
              {banks.map((bank) => (
                <tr key={bank.id || `${bank.bank_name}-${bank.ac_no}`}>
                  <td>{show(bank.bank_name)}</td>
                  <td>{show(bank.ac_no)}</td>
                  <td>{show(bank.branch_name)}</td>
                  <td>{show(bank.ifsc_code)}</td>
                  <td>{bank.is_primary ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <DocumentAttachments
          documentType={ATTACHMENT_DOCUMENT_TYPES.COMPANY}
          documentId={data?.id}
          readOnly
          inline
        />
      </Card.Body>
    </Card>
  );
};

export default CompanyDetailView;
