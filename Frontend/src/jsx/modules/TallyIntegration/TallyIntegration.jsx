import { useMemo, useState } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import { COMPANY_ID, CONNECTION, METHODS, MODULES } from "./examples";

const methodColor = {
  GET: "info",
  POST: "success",
  PUT: "warning",
  PATCH: "primary",
  DELETE: "danger",
};

function pretty(value) {
  return JSON.stringify(value, null, 2);
}

const TallyIntegration = () => {
  const [activeId, setActiveId] = useState(MODULES[0].id);
  const [copied, setCopied] = useState(false);
  const module = useMemo(
    () => MODULES.find((item) => item.id === activeId) || MODULES[0],
    [activeId]
  );
  const jsonText = useMemo(() => pretty(module.example), [module]);
  const methods = module.readOnly
    ? METHODS.filter((item) => item.method === "GET" || item.method === "PATCH")
    : METHODS;

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <PageTitle activeMenu="Tally Integration" motherMenu="Settings" />

      <Col lg={12}>
        <Card className="border-0 shadow-sm mb-3">
          <Card.Body>
            <div className="d-flex flex-wrap justify-content-between gap-3">
              <div>
                <h4 className="mb-1">Tally Integration</h4>
                <p className="text-muted mb-0">
                  Working JSON for every Tally endpoint. Send{" "}
                  <code>Content-Type: application/json</code>. No login token.
                </p>
              </div>
              <Badge bg="dark" className="align-self-start">
                {CONNECTION.basePath}
              </Badge>
            </div>
            <Row className="g-3 mt-1">
              <Col md={3}>
                <div className="tally-fact">
                  <span>Company</span>
                  <strong>?company_id={COMPANY_ID}</strong>
                </div>
              </Col>
              <Col md={3}>
                <div className="tally-fact">
                  <span>Body</span>
                  <strong>{CONNECTION.batch}</strong>
                </div>
              </Col>
              <Col md={3}>
                <div className="tally-fact">
                  <span>Dates</span>
                  <strong>{CONNECTION.dates}</strong>
                </div>
              </Col>
              <Col md={3}>
                <div className="tally-fact">
                  <span>Repeat post</span>
                  <strong>{CONNECTION.repost}</strong>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row className="g-3">
          <Col lg={3}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white fw-semibold">Modules</Card.Header>
              <div className="list-group list-group-flush">
                {MODULES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${
                      item.id === module.id ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveId(item.id);
                      setCopied(false);
                    }}
                  >
                    <div className="fw-semibold">{item.title}</div>
                    <small className={item.id === module.id ? "text-white-50" : "text-muted"}>
                      /api/tally/{item.path}
                    </small>
                  </button>
                ))}
              </div>
            </Card>
          </Col>

          <Col lg={9}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white d-flex flex-wrap justify-content-between gap-2">
                <div>
                  <Card.Title className="mb-1">{module.title}</Card.Title>
                  <code>/api/tally/{module.path}</code>
                </div>
                {module.readOnly && <Badge bg="secondary">GET and PATCH only</Badge>}
              </Card.Header>
              <Card.Body>
                <p>{module.summary}</p>

                <h6 className="mt-3">Endpoints</h6>
                <div className="table-responsive mb-3">
                  <table className="table table-sm table-bordered mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: 90 }}>Method</th>
                        <th>Action</th>
                        <th>Path</th>
                      </tr>
                    </thead>
                    <tbody>
                      {methods.map((item) => (
                        <tr key={`${item.method}-${item.action}`}>
                          <td>
                            <Badge bg={methodColor[item.method]}>{item.method}</Badge>
                          </td>
                          <td>{item.action}</td>
                          <td>
                            <code>
                              /api/tally/{module.path}
                              {item.path}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h6>Required fields</h6>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {module.minimum.map((field) => (
                    <Badge key={field} bg="light" text="dark" className="border">
                      {field}
                    </Badge>
                  ))}
                </div>

                {module.notes?.length > 0 && (
                  <>
                    <h6>Notes</h6>
                    <ul>
                      {module.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">
                    {module.readOnly ? "Export JSON" : "Working POST JSON"}
                  </h6>
                  <Button size="sm" variant="outline-primary" onClick={copyJson}>
                    {copied ? "Copied" : "Copy JSON"}
                  </Button>
                </div>
                <pre className="tally-json">
                  <code>{jsonText}</code>
                </pre>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>

      <style>{`
        .tally-fact {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 0.75rem;
          height: 100%;
        }
        .tally-fact span {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          color: #6c757d;
          margin-bottom: 0.25rem;
        }
        .tally-fact strong {
          font-size: 13px;
          font-weight: 600;
        }
        .tally-json {
          background: #1e1e2d;
          color: #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          max-height: 640px;
          overflow: auto;
          font-size: 12.5px;
          margin-bottom: 0;
        }
      `}</style>
    </>
  );
};

export default TallyIntegration;
