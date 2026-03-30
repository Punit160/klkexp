import { Link } from "react-router-dom";
import { SVGICON } from "../../constant/theme";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { useState } from "react";
import SkyGreeting from "../../components/Common/SkyGreeting";
import ChartBarRunning from "../../components/dashboard/chartbarrunning";
import ChartBarRunning2 from "../../components/dashboard/chartbarrunning2";
import ChartBarRunning3 from "../../components/dashboard/chartbarrunning3";
import ChartBarRunning4 from "../../components/dashboard/chartbarrunning4";

const expenseTableData = [
    { id: "#EX-1042", date: "18 Mar 2025", employee: "Rohit Sharma",  dept: "Engineering", category: "Travel",         amount: "₹12,400", status: <span className="badge badge-success light">Approved</span>  },
    { id: "#EX-1041", date: "16 Mar 2025", employee: "Priya Mehta",   dept: "Marketing",   category: "Food & Dining",  amount: "₹3,200",  status: <span className="badge badge-warning light">Pending</span>   },
    { id: "#EX-1040", date: "15 Mar 2025", employee: "Anil Gupta",    dept: "HR",          category: "Office Supply",  amount: "₹8,750",  status: <span className="badge badge-success light">Approved</span>  },
    { id: "#EX-1039", date: "14 Mar 2025", employee: "Sneha Joshi",   dept: "Finance",     category: "Travel",         amount: "₹22,000", status: <span className="badge badge-danger light">Rejected</span>   },
    { id: "#EX-1038", date: "13 Mar 2025", employee: "Vikram Nair",   dept: "Sales",       category: "Client Gift",    amount: "₹5,600",  status: <span className="badge badge-info light">In Review</span>    },
    { id: "#EX-1037", date: "12 Mar 2025", employee: "Kavya Reddy",   dept: "Product",     category: "Software",       amount: "₹14,999", status: <span className="badge badge-success light">Approved</span>  },
];

const pendingApprovals = [
    { initials: "PM", name: "Priya Mehta",  dept: "Marketing",  category: "Food & Dining",   amount: "₹3,200",  date: "16 Mar" },
    { initials: "VN", name: "Vikram Nair",  dept: "Sales",      category: "Client Gift",     amount: "₹5,600",  date: "13 Mar" },
    { initials: "SJ", name: "Shyam Jain",   dept: "Operations", category: "Travel",          amount: "₹9,800",  date: "11 Mar" },
    { initials: "DK", name: "Divya Kumar",  dept: "Admin",      category: "Office Supplies", amount: "₹4,150",  date: "10 Mar" },
];

const topSpenders = [
    { initials: "RS", name: "Rohit Sharma", dept: "Engineering", amount: "₹42,400", count: 8  },
    { initials: "KR", name: "Kavya Reddy",  dept: "Product",     amount: "₹31,999", count: 5  },
    { initials: "VN", name: "Vikram Nair",  dept: "Sales",       amount: "₹28,600", count: 12 },
    { initials: "AG", name: "Anil Gupta",   dept: "HR",          amount: "₹18,750", count: 6  },
    { initials: "PM", name: "Priya Mehta",  dept: "Marketing",   amount: "₹14,200", count: 9  },
];

const budgetData = [
    { name: "Travel",           used: 72, color: "bg-primary" },
    { name: "Food & Dining",    used: 45, color: "bg-success" },
    { name: "Office Supplies",  used: 88, color: "bg-danger"  },
    { name: "Marketing",        used: 60, color: "bg-info"    },
    { name: "Software & Tools", used: 34, color: "bg-warning" },
];

const AdminDashboard = () => {
    const [selectedYear, setSelectedYear] = useState("2025-26");
    const [tableData]   = useState(expenseTableData);
    const [approvals, setApprovals] = useState(pendingApprovals);

    const handleApprove = (index) => setApprovals(prev => prev.filter((_, i) => i !== index));
    const handleReject  = (index) => setApprovals(prev => prev.filter((_, i) => i !== index));

    return (
        <>
            {/* ── Page Header ── */}
            <div className="page-head">
                <div className="row align-items-center">
                    <div className="col-sm-8 mb-sm-4">
                        <SkyGreeting />
                    </div>
                    <div className="col-sm-4 mb-4 text-sm-end">
                        <div className="d-inline-flex align-items-center gap-2">
                            <select
                                className="form-select w-auto"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="">Select Financial Year</option>
                                <option value="2025-26">FY 2025 - 2026</option>
                                <option value="2024-25">FY 2024 - 2025</option>
                                <option value="2023-24">FY 2023 - 2024</option>
                                <option value="2022-23">FY 2022 - 2023</option>
                            </select>
                            <Link to="/add-expense" className="btn btn-primary d-flex align-items-center gap-1">
                                + Raise Expense
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROW 1: FIRST 4 STAT CARDS ── */}
            <div className="row">

                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Total Expense</h6>
                            <Dropdown className="dropdown ms-auto c-pointer">
                                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item>View Detail</Dropdown.Item>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">₹1,25,000</h2>
                            <span><small className="text-success font-w600 me-1">+5%</small>than last month</span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div className="progress-bar bg-primary" style={{ width: "72%" }}></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Budget Used</small>
                                <small className="text-muted font-w600">72%</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Expense Raised</h6>
                            <Dropdown className="dropdown ms-auto c-pointer">
                                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item>View Detail</Dropdown.Item>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">₹75,000</h2>
                            <span><small className="text-info font-w600 me-1">+3%</small>than last month</span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div className="progress-bar bg-info" style={{ width: "60%" }}></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Of Total Expense</small>
                                <small className="text-muted font-w600">60%</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Paid Expenses</h6>
                            <Dropdown className="dropdown ms-auto c-pointer">
                                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item>View Detail</Dropdown.Item>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">₹60,000</h2>
                            <span><small className="text-success font-w600 me-1">+8%</small>than last month</span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div className="progress-bar bg-success" style={{ width: "80%" }}></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Of Raised</small>
                                <small className="text-muted font-w600">80%</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Rejected Expenses</h6>
                            <Dropdown className="dropdown ms-auto c-pointer">
                                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item>View Detail</Dropdown.Item>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">₹15,000</h2>
                            <span><small className="text-danger font-w600 me-1">-2%</small>than last month</span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div className="progress-bar bg-danger" style={{ width: "12%" }}></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Of Total Expense</small>
                                <small className="text-muted font-w600">12%</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROW 2: SECOND 4 STAT CARDS ── */}
            <div className="row">

                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Claims Submitted</h6>
                            <Dropdown className="dropdown ms-auto c-pointer">
                                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item>View Detail</Dropdown.Item>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">148</h2>
                            <span><small className="text-success font-w600 me-1">+12</small>this month</span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div className="progress-bar bg-primary" style={{ width: "65%" }}></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Total Claims</small>
                                <small className="text-muted font-w600">148 / 230</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Pending Review</h6>
                            <Dropdown className="dropdown ms-auto c-pointer">
                                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item>View Detail</Dropdown.Item>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">24</h2>
                            <span><small className="text-warning font-w600 me-1">+4</small>since yesterday</span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div className="progress-bar bg-warning" style={{ width: "40%" }}></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Awaiting Action</small>
                                <small className="text-muted font-w600">24 open</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Payment Processed</h6>
                            <Dropdown className="dropdown ms-auto c-pointer">
                                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item>View Detail</Dropdown.Item>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">₹48,500</h2>
                            <span><small className="text-success font-w600 me-1">+6%</small>than last month</span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div className="progress-bar bg-success" style={{ width: "55%" }}></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Of Paid Expenses</small>
                                <small className="text-muted font-w600">55%</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-sm-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="mb-0">Reimbursement Due</h6>
                            <Dropdown className="dropdown ms-auto c-pointer">
                                <Dropdown.Toggle as="div" className="btn-link i-false">{SVGICON.threedot}</Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item>View Detail</Dropdown.Item>
                                    <Dropdown.Item>Download</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="card-body pt-2">
                            <h2 className="card-title mb-0">₹11,500</h2>
                            <span><small className="text-danger font-w600 me-1">-1%</small>than last month</span>
                            <div className="progress mt-3" style={{ height: "6px" }}>
                                <div className="progress-bar bg-danger" style={{ width: "22%" }}></div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Overdue Amount</small>
                                <small className="text-muted font-w600">₹3,200</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROW 3: CHART (8) + BUDGET UTILISATION (4) ── */}
            <div className="row">
                <div className="col-xl-8">
                    <Tab.Container defaultActiveKey="week">
                        <div className="card overflow-hidden">
                            <div className="card-header border-0 pb-0 flex-wrap">
                                <div className="blance-media">
                                    <h5 className="mb-0">Expense Overview</h5>
                                    <h4 className="mb-0">₹1,25,000 <span className="badge badge-sm badge-success light">+5%</span></h4>
                                </div>
                                <Nav className="nav nav-pills mix-chart-tab" defaultActiveKey="week">
                                    <Nav.Item><Nav.Link eventKey="week">Week</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="month">Month</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="year">Year</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="all">All</Nav.Link></Nav.Item>
                                </Nav>
                            </div>
                            <div className="card-body p-0">
                                <Tab.Content>
                                    <Tab.Pane eventKey="week">
                                        <div id="chartBarRunning" className="pt-0"><ChartBarRunning /></div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="month">
                                        <div id="chartBarRunning2" className="pt-0"><ChartBarRunning2 /></div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="year">
                                        <div id="chartBarRunning3" className="pt-0"><ChartBarRunning3 /></div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="all">
                                        <div id="chartBarRunning4" className="pt-0"><ChartBarRunning4 /></div>
                                    </Tab.Pane>
                                </Tab.Content>
                                <div className="ttl-project">
                                    <div className="pr-data">
                                        <h5>148</h5>
                                        <span>Total Claims</span>
                                    </div>
                                    <div className="pr-data">
                                        <h5 className="text-primary">24</h5>
                                        <span>Pending Review</span>
                                    </div>
                                    <div className="pr-data">
                                        <h5>₹60,000</h5>
                                        <span>Paid Amount</span>
                                    </div>
                                    <div className="pr-data">
                                        <h5 className="text-danger">₹15,000</h5>
                                        <span>Rejected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab.Container>
                </div>

                <div className="col-xl-4">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h5 className="mb-0">Budget Utilisation</h5>
                            <span className="badge badge-warning light">Q1 {selectedYear}</span>
                        </div>
                        <div className="card-body">
                            {budgetData.map((item, i) => (
                                <div key={i} className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="fs-14 font-w500">{item.name}</span>
                                        <span className="fs-14 font-w700">{item.used}%</span>
                                    </div>
                                    <div className="progress" style={{ height: "8px" }}>
                                        <div className={`progress-bar ${item.color}`} style={{ width: `${item.used}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROW 4: EXPENSE TABLE ── */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header flex-wrap">
                            <h5 className="mb-0">Recent Expense Requests</h5>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <div className="input-group search-area style-1">
                                    <span className="input-group-text">
                                        <Link to={"#"} className="m-0"><i className="flaticon-search-interface-symbol" /></Link>
                                    </span>
                                    <input type="text" className="form-control" placeholder="Search expense..." />
                                </div>
                                <Link to={"#"} className="btn btn-sm btn-primary">+ New Expense</Link>
                            </div>
                        </div>
                        <div className="card-body pb-2">
                            <div className="table-responsive">
                                <table className="table transaction-tbl ItemsCheckboxSec dataTable no-footer mb-0">
                                    <thead className="border-self">
                                        <tr>
                                            <th>#ID</th>
                                            <th>Date</th>
                                            <th>Employee</th>
                                            <th>Category</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((row, i) => (
                                            <tr key={i}>
                                                <td><span className="text-muted">{row.id}</span></td>
                                                <td><p className="mb-0">{row.date}</p></td>
                                                <td>
                                                    <span className="font-w600">{row.employee}</span>
                                                    <p className="mb-0 text-muted fs-12">{row.dept}</p>
                                                </td>
                                                <td><span>{row.category}</span></td>
                                                <td><span className="font-w700">{row.amount}</span></td>
                                                <td>{row.status}</td>
                                                <td>
                                                    <Dropdown className="dropdown c-pointer ms-2" align="end">
                                                        <Dropdown.Toggle as="div" className="btn-link i-false custome-d">
                                                            {SVGICON.tableaction}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item>View</Dropdown.Item>
                                                            <Dropdown.Item>Approve</Dropdown.Item>
                                                            <Dropdown.Item>Reject</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-between align-items-center border-0 pt-0">
                            <small className="text-muted">Showing 6 of 128 records</small>
                            <Link to={"#"} className="btn btn-sm btn-outline-primary">View All</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROW 5: TOP SPENDERS (6) + PENDING APPROVALS (6) ── */}
            <div className="row">

                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h5 className="mb-0">Top Spenders — March</h5>
                            <span className="badge badge-info light">This Month</span>
                        </div>
                        <div className="card-body pt-2">
                            {topSpenders.map((person, i) => (
                                <div key={i} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center text-white font-w700"
                                            style={{ width: 40, height: 40, fontSize: 13, background: `hsl(${i * 60}, 65%, 52%)` }}
                                        >
                                            {person.initials}
                                        </div>
                                        <div>
                                            <p className="mb-0 font-w600">{person.name}</p>
                                            <small className="text-muted">{person.dept} · {person.count} expenses</small>
                                        </div>
                                    </div>
                                    <span className="font-w700 text-primary fs-16">{person.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h5 className="mb-0">Pending Approvals</h5>
                            <span className="badge badge-warning light">{approvals.length} Awaiting</span>
                        </div>
                        <div className="card-body pt-2">
                            {approvals.length === 0 && (
                                <p className="text-muted text-center py-3">All caught up! No pending approvals.</p>
                            )}
                            {approvals.map((item, i) => (
                                <div key={i} className="d-flex align-items-center justify-content-between py-2 border-bottom gap-2">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center text-white font-w700"
                                            style={{ width: 40, height: 40, fontSize: 13, background: `hsl(${i * 80 + 200}, 60%, 50%)` }}
                                        >
                                            {item.initials}
                                        </div>
                                        <div>
                                            <p className="mb-0 font-w600">{item.name} — <span className="text-primary">{item.amount}</span></p>
                                            <small className="text-muted">{item.category} · {item.date}</small>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-success light" onClick={() => handleApprove(i)}>Approve</button>
                                        <button className="btn btn-sm btn-danger light"  onClick={() => handleReject(i)}>Reject</button>
                                    </div>
                                </div>
                            ))}
                            {approvals.length > 0 && (
                                <div className="text-center mt-3">
                                    <Link to={"#"} className="btn btn-primary btn-sm">View All Pending</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default AdminDashboard;