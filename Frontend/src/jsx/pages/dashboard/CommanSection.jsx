import { Dropdown, Nav, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SVGICON } from "../../constant/theme";
import Contactdata from "../../element/contactdata";
import InvoiceChart from "../../components/dashboard/invoicechart";
import EarningsChart from "../../components/dashboard/earningschart";
import EarningPredictionChart from "../../components/dashboard/earningpredictionchart";
import { BsCurrencyDollar, BsTools, BsCupStraw, BsTruck, BsHouse, BsLightningCharge, BsCashStack } from "react-icons/bs";
function Dashboard() {
	return (
		<>

			
<div className="page-head">
	<div className="row align-items-center">
		
		<div className="col-sm-6 mb-sm-4 mb-3">
			<h3 className="mb-0">Good Morning, SuperAdmin.</h3>
			<p className="mb-0">
				Here’s what’s happening with your store today
			</p>
		</div>

		<div className="col-sm-6 mb-4 text-sm-end">
			<div className="d-inline-flex align-items-center gap-2">

				<select className="form-select w-auto">
					<option value="">Select Financial Year</option>
					<option value="2025-26">2025 - 2026</option>
					<option value="2024-25">2024 - 2025</option>
					<option value="2023-24">2023 - 2024</option>
					<option value="2022-23">2022 - 2023</option>
				</select>

				<Link to="/add-expense" className="btn btn-primary">
					+ Add Expense
				</Link>

			</div>
		</div>

	</div>
</div>

			<div className="row">
				{/* Total Expense */}
				<div className="col-xl-3 col-sm-6">
					<div className="card">
						<div className="card-header border-0 pb-0">
							<h6 className="mb-0">Total Expense</h6>
						</div>
						<div className="card-body pt-2">
							<div className="d-flex align-items-center justify-content-between">
								<div>
									<h2 className="card-title">₹ 1,25,000</h2>
									<span>
										<small className="text-success font-w600 me-1">+5%</small>
										than last week
									</span>
								</div>
								<div id="totalInvoices">
									<InvoiceChart />
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Expense Raised */}
				<div className="col-xl-3 col-sm-6">
					<div className="card">
						<div className="card-header border-0 pb-0">
							<h6 className="mb-0">Expense Raised</h6>
							<Dropdown className="dropdown ms-auto c-pointer">
								<Dropdown.Toggle as="div" className="btn-link i-false">
									{SVGICON.threedot}
								</Dropdown.Toggle>
								<Dropdown.Menu className="dropdown-menu dropdown-menu-end" align="end">
									<Dropdown.Item>Edit</Dropdown.Item>
									<Dropdown.Item>Delete</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
						<div className="card-body pt-2">
							<div className="d-flex align-items-center justify-content-between">
								<div>
									<h2 className="card-title">₹ 75,000</h2>
									<span>
										<small className="text-info font-w600 me-1">+3%</small>
										than last week
									</span>
								</div>
								<div id="chart">
									<EarningsChart />
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Paid Expenses */}
				<div className="col-xl-3 col-sm-6">
					<div className="card">
						<div className="card-header border-0 pb-0">
							<h6 className="mb-0">Paid Expenses</h6>
							<Dropdown className="dropdown ms-auto c-pointer">
								<Dropdown.Toggle as="div" className="btn-link i-false">
									{SVGICON.threedot}
								</Dropdown.Toggle>
								<Dropdown.Menu className="dropdown-menu dropdown-menu-end" align="end">
									<Dropdown.Item>Edit</Dropdown.Item>
									<Dropdown.Item>Delete</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
						<div className="card-body pt-2">
							<div className="d-flex align-items-center justify-content-between">
								<div>
									<h2 className="card-title">₹ 60,000</h2>
									<span>
										<small className="text-success font-w600 me-1">+8%</small>
										than last week
									</span>
								</div>
								<div id="chart-1">
									<EarningsChart />
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Rejected Expenses */}
				<div className="col-xl-3 col-sm-6">
					<div className="card">
						<div className="card-header border-0 pb-0">
							<h6 className="mb-0">Rejected Expenses</h6>
							<Dropdown className="dropdown ms-auto c-pointer">
								<Dropdown.Toggle as="div" className="btn-link i-false">
									{SVGICON.threedot}
								</Dropdown.Toggle>
								<Dropdown.Menu className="dropdown-menu dropdown-menu-end" align="end">
									<Dropdown.Item>Edit</Dropdown.Item>
									<Dropdown.Item>Delete</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
						<div className="card-body pt-2">
							<div className="d-flex align-items-center justify-content-between">
								<div>
									<h2 className="card-title">₹ 15,000</h2>
									<span>
										<small className="text-danger font-w600 me-1">-2%</small>
										than last week
									</span>
								</div>
								<div id="totalInvoices-1">
									<InvoiceChart />
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* graph caqrd here  */}
				<div className="col-xl-8">
					<div className="card">
						<div className="card-header">
							<h4 className="mb-0">Expense Prediction</h4>
						</div>
						<div className="card-body">
							<div id="EarningsPrediction">
								<EarningPredictionChart />
							</div>
						</div>
					</div>
				</div>


				<div className="col-xl-4">
					<div className="card">
						<div className="card-header border-0 pb-0">
							<h4 className="mb-0">Recent Expense Creators</h4>
						</div>
						<Contactdata gap="g-4" />
					</div>
				</div>

				<div className="col-xl-6">
					<div className="card">
						<div className="card-header">
							<h4 className="mb-0">Project Wise Expenses</h4>
						</div>
						<div className="card-body px-0">
							<Tab.Container defaultActiveKey="social">
								<Nav className="nav nav-pills success-tab">

									<Nav.Item className="nav-item">
										<Nav.Link eventKey="sale" className="nav-link w-100">{SVGICON.scale} <span>Amount</span></Nav.Link>
									</Nav.Item>

									<Nav.Item className="nav-item">
										<Nav.Link eventKey="social" className="nav-link w-100">{SVGICON.socialheart} <span>State Wise</span></Nav.Link>
									</Nav.Item>
									<Nav.Item className="nav-item">
										<Nav.Link eventKey="project" className="nav-link w-100">{SVGICON.project} <span>Project Wise</span></Nav.Link>
									</Nav.Item>

									<Nav.Item className="nav-item">
										<Nav.Link eventKey="mobile" className="nav-link w-100">{SVGICON.mobile} <span>Payment Status</span></Nav.Link>
									</Nav.Item>

								</Nav>
								<Tab.Content>
									{/* STATE WISE EXPENSES */}
									<Tab.Pane eventKey="social">
										<div className="table-responsive">
											<table className="table card-table border-no success-tbl">
												<thead>
													<tr>
														<th>Project</th>
														<th>Expense %</th>
														<th>Date</th>
														<th>Status</th>
														<th>Amount</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Solar Panel Installation</h6>
																	<span>State: Maharashtra</span>
																</div>
															</div>
														</td>
														<td>75%</td>
														<td>15 Mar 2026</td>
														<td><span className="badge badge-primary light border-0">In Progress</span></td>
														<td>₹ 4.5L</td>
													</tr>
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Wind Turbine Setup</h6>
																	<span>State: Gujarat</span>
																</div>
															</div>
														</td>
														<td>60%</td>
														<td>12 Mar 2026</td>
														<td><span className="badge badge-danger light border-0">Pending</span></td>
														<td>₹ 3.2L</td>
													</tr>
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Battery Storage Project</h6>
																	<span>State: Karnataka</span>
																</div>
															</div>
														</td>
														<td>90%</td>
														<td>10 Mar 2026</td>
														<td><span className="badge badge-success light border-0">Completed</span></td>
														<td>₹ 6.8L</td>
													</tr>

													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Battery Storage Project</h6>
																	<span>State: Karnataka</span>
																</div>
															</div>
														</td>
														<td>90%</td>
														<td>10 Mar 2026</td>
														<td><span className="badge badge-success light border-0">Completed</span></td>
														<td>₹ 6.8L</td>
													</tr>

													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Battery Storage Project</h6>
																	<span>State: Karnataka</span>
																</div>
															</div>
														</td>
														<td>90%</td>
														<td>10 Mar 2026</td>
														<td><span className="badge badge-success light border-0">Completed</span></td>
														<td>₹ 6.8L</td>
													</tr>


													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Battery Storage Project</h6>
																	<span>State: Karnataka</span>
																</div>
															</div>
														</td>
														<td>90%</td>
														<td>10 Mar 2026</td>
														<td><span className="badge badge-success light border-0">Completed</span></td>
														<td>₹ 6.8L</td>
													</tr>

													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Battery Storage Project</h6>
																	<span>State: Karnataka</span>
																</div>
															</div>
														</td>
														<td>90%</td>
														<td>10 Mar 2026</td>
														<td><span className="badge badge-success light border-0">Completed</span></td>
														<td>₹ 6.8L</td>
													</tr>
												</tbody>
											</table>
										</div>
									</Tab.Pane>

									{/* PROJECT WISE EXPENSES */}
									<Tab.Pane eventKey="project">
										<div className="table-responsive">
											<table className="table card-table border-no success-tbl">
												<thead>
													<tr>
														<th>Project</th>
														<th>Expense %</th>
														<th>Date</th>
														<th>Status</th>
														<th>Amount</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Solar Panel Installation</h6>
																	<span>District: Pune</span>
																</div>
															</div>
														</td>
														<td>75%</td>
														<td>15 Mar 2026</td>
														<td><span className="badge badge-primary light border-0">In Progress</span></td>
														<td>₹ 4.5L</td>
													</tr>
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Wind Turbine Setup</h6>
																	<span>District: Rajkot</span>
																</div>
															</div>
														</td>
														<td>60%</td>
														<td>12 Mar 2026</td>
														<td><span className="badge badge-danger light border-0">Pending</span></td>
														<td>₹ 3.2L</td>
													</tr>
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Battery Storage Project</h6>
																	<span>District: Bengaluru</span>
																</div>
															</div>
														</td>
														<td>90%</td>
														<td>10 Mar 2026</td>
														<td><span className="badge badge-success light border-0">Completed</span></td>
														<td>₹ 6.8L</td>
													</tr>
												</tbody>
											</table>
										</div>
									</Tab.Pane>

									{/* AMOUNT */}
									<Tab.Pane eventKey="sale">
										<div className="table-responsive">
											<table className="table card-table border-no success-tbl">
												<thead>
													<tr>
														<th>Project</th>
														<th>Expense %</th>
														<th>Date</th>
														<th>Status</th>
														<th>Amount</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Solar Panel Installation</h6>
																	<span>State: Maharashtra</span>
																</div>
															</div>
														</td>
														<td>75%</td>
														<td>15 Mar 2026</td>
														<td><span className="badge badge-primary light border-0">In Progress</span></td>
														<td>₹ 4.5L</td>
													</tr>
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Wind Turbine Setup</h6>
																	<span>State: Gujarat</span>
																</div>
															</div>
														</td>
														<td>60%</td>
														<td>12 Mar 2026</td>
														<td><span className="badge badge-danger light border-0">Pending</span></td>
														<td>₹ 3.2L</td>
													</tr>
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Battery Storage Project</h6>
																	<span>State: Karnataka</span>
																</div>
															</div>
														</td>
														<td>90%</td>
														<td>10 Mar 2026</td>
														<td><span className="badge badge-success light border-0">Completed</span></td>
														<td>₹ 6.8L</td>
													</tr>
												</tbody>
											</table>
										</div>
									</Tab.Pane>

									{/* PAYMENT STATUS */}
									<Tab.Pane eventKey="mobile">
										<div className="table-responsive">
											<table className="table card-table border-no success-tbl">
												<thead>
													<tr>
														<th>Project</th>
														<th>Expense %</th>
														<th>Date</th>
														<th>Status</th>
														<th>Payment</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Solar Panel Installation</h6>
																	<span>Paid by: Maharashtra Team</span>
																</div>
															</div>
														</td>
														<td>75%</td>
														<td>15 Mar 2026</td>
														<td><span className="badge badge-primary light border-0">Paid</span></td>
														<td>₹ 4.5L</td>
													</tr>
													<tr>
														<td>
															<div className="d-flex align-items-center">
																<div className="ms-2 cat-name">
																	<h6 className="mb-0">Wind Turbine Setup</h6>
																	<span>Paid by: Gujarat Team</span>
																</div>
															</div>
														</td>
														<td>60%</td>
														<td>12 Mar 2026</td>
														<td><span className="badge badge-danger light border-0">Pending</span></td>
														<td>₹ 3.2L</td>
													</tr>
												</tbody>
											</table>
										</div>
									</Tab.Pane>



								</Tab.Content>
							</Tab.Container>
						</div>
					</div>
				</div>




				<div className="col-xl-3">
					<div className="card">
						<div className="card-header">
							<h4 className="mb-0">Activity</h4>
						</div>
						<div className="card-body">
							<div className="widget-timeline-status">
								<ul className="timeline">
									<li>
										<span className="timeline-status">08:30</span>
										<div className="timeline-badge border-dark"></div>
										<div className="timeline-panel"> <span>Quisque a consequat ante Sit amet magna at volutapt.</span> </div>
									</li>
									<li>
										<span className="timeline-status">10:30</span>
										<div className="timeline-badge border-success"></div>
										<div className="timeline-panel"> <span className="text-black fs-14 fw-semibold">Video Sharing</span> </div>
									</li>
									<li>
										<span className="timeline-status">02:42</span>
										<div className="timeline-badge border-danger"></div>
										<div className="timeline-panel"> <span className="text-black fs-14 fw-semibold">john just buy your product Sell <span className="text-primary">$250</span></span> </div>
									</li>
									<li>
										<span className="timeline-status">15:40</span>
										<div className="timeline-badge border-info"></div>
										<div className="timeline-panel"> <span>Mashable, a news website and blog, goes live.</span> </div>
									</li>
									<li>
										<span className="timeline-status">23:12</span>
										<div className="timeline-badge border-warning"></div>
										<div className="timeline-panel"> <span className="text-black fs-14 fw-semibold">StumbleUpon is acquired by <span className="text-primary">eBay</span></span> </div>
									</li>
									<li>
										<span className="timeline-status">11:12</span>
										<div className="timeline-badge border-primary"></div>
										<div className="timeline-panel"> <span>shared this on my fb wall a few months back.</span> </div>
									</li>
									<li>
										<span className="timeline-status">08:30</span>
										<div className="timeline-badge border-dark"></div>
										<div className="timeline-panel"> <span>Quisque a consequat ante Sit amet magna at volutapt.</span> </div>
									</li>
									<li>
										<span className="timeline-status">10:30</span>
										<div className="timeline-badge border-success"></div>
										<div className="timeline-panel"> <span className="text-black fs-14 fw-semibold">Video Sharing</span> </div>
									</li>
									<li>
										<span className="timeline-status">02:42</span>
										<div className="timeline-badge border-danger"></div>
										<div className="timeline-panel"> <span className="text-black fs-14 fw-semibold">john just buy your product Sell <span className="text-primary">$250</span></span> </div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>




				<div className="col-xl-3">
					<div className="card">
						<div className="card-header pb-0 border-0 d-flex justify-content-between align-items-start">
							<div>
								<h5 className="mb-0">Expense Overview</h5>
								<small className="d-block">12 New Requests & 5 Approved</small>
							</div>
							<button
								type="button"
								className="btn btn-light btn-icon-xxs tp-btn fs-18 align-self-start"
							>
								<i className="bi bi-grid" />
							</button>
						</div>
						<div className="card-body">
							<div className="d-flex align-items-center py-2 hover-bg-light rounded my-1">
								<div className="avatar avatar-md style-1 border border-opacity-10 rounded d-flex align-items-center justify-content-center bg-white">
									<BsCurrencyDollar size={24} />
								</div>
								<div className="clearfix ms-3">
									<h6 className="mb-0 fw-semibold">Office Supplies</h6>
									<span className="fs-13">Pending Approval</span>
								</div>
								<div className="clearfix ms-auto">
									<span className="badge badge-sm badge-light">2</span>
								</div>
							</div>

							<div className="d-flex align-items-center py-2 hover-bg-light rounded my-1">
								<div className="avatar avatar-md style-1 border border-opacity-10 rounded d-flex align-items-center justify-content-center bg-white">
									<BsTools size={24} />
								</div>
								<div className="clearfix ms-3">
									<h6 className="mb-0 fw-semibold">Maintenance Expense</h6>
									<span className="fs-13">Approved</span>
								</div>
								<div className="clearfix ms-auto">
									<span className="badge badge-sm badge-light">5</span>
								</div>
							</div>

							<div className="d-flex align-items-center py-2 hover-bg-light rounded my-1">
								<div className="avatar avatar-md style-1 border border-opacity-10 rounded d-flex align-items-center justify-content-center bg-white">
									<BsCupStraw size={24} />
								</div>
								<div className="clearfix ms-3">
									<h6 className="mb-0 fw-semibold">Canteen Expenses</h6>
									<span className="fs-13">Pending</span>
								</div>
								<div className="clearfix ms-auto">
									<span className="badge badge-sm badge-light">3</span>
								</div>
							</div>

							<div className="d-flex align-items-center py-2 hover-bg-light rounded my-1">
								<div className="avatar avatar-md style-1 border border-opacity-10 rounded d-flex align-items-center justify-content-center bg-white">
									<BsTruck size={24} />
								</div>
								<div className="clearfix ms-3">
									<h6 className="mb-0 fw-semibold">Travel Reimbursements</h6>
									<span className="fs-13">Approved</span>
								</div>
								<div className="clearfix ms-auto">
									<span className="badge badge-sm badge-light">4</span>
								</div>
							</div>


							{/* Rent */}
							<div className="d-flex align-items-center py-2 hover-bg-light rounded my-1">
								<div className="avatar avatar-md style-1 border border-opacity-10 rounded d-flex align-items-center justify-content-center bg-white">
									<BsHouse size={24} />
								</div>
								<div className="clearfix ms-3">
									<h6 className="mb-0 fw-semibold">Office Rent</h6>
									<span className="fs-13">Paid</span>
								</div>
								<div className="clearfix ms-auto">
									<span className="badge badge-sm badge-light">1</span>
								</div>
							</div>


							{/* Electricity Bills */}
							<div className="d-flex align-items-center py-2 hover-bg-light rounded my-1">
								<div className="avatar avatar-md style-1 border border-opacity-10 rounded d-flex align-items-center justify-content-center bg-white">
									<BsLightningCharge size={24} />
								</div>
								<div className="clearfix ms-3">
									<h6 className="mb-0 fw-semibold">Electricity Bills</h6>
									<span className="fs-13">Pending</span>
								</div>
								<div className="clearfix ms-auto">
									<span className="badge badge-sm badge-light">2</span>
								</div>
							</div>


							{/* Cash Payments */}
							<div className="d-flex align-items-center py-2 hover-bg-light rounded my-1">
								<div className="avatar avatar-md style-1 border border-opacity-10 rounded d-flex align-items-center justify-content-center bg-white">
									<BsCashStack size={24} />
								</div>
								<div className="clearfix ms-3">
									<h6 className="mb-0 fw-semibold">Cash Payments</h6>
									<span className="fs-13">Approved</span>
								</div>
								<div className="clearfix ms-auto">
									<span className="badge badge-sm badge-light">3</span>
								</div>
							</div>


							<div className="alert alert-primary border-primary outline-dashed py-3 px-3 mt-4 mb-0 text-black">
								<strong className="text-primary">Reminder:</strong> Submit all pending expense requests for this month to avoid delays in payment.
							</div>
						</div>
					</div>
				</div>


			</div>
		</>
	)
}
export default Dashboard;
