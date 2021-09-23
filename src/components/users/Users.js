import React from 'react';
import Breadcrumbs from "../misc/Breadcrumbs";
import {Link, NavLink} from "react-router-dom";

function Users(props) {
	return (
		<React.Fragment>
			<Breadcrumbs category={'User Management'} title={'Users'} />
			<div className="card">
				<div className="card-body">
					<div className="d-lg-flex align-items-center mb-4 gap-3">
						<div className="position-relative">
							<input type="text" className="form-control ps-5 radius-30" placeholder="Search Order" /> 
							<span className="position-absolute top-50 product-show translate-middle-y">
								<i className="bx bx-search"/>
							</span>
						</div>
						<div className="ms-auto">
							<NavLink to={'/users/create'} className="btn btn-primary radius-30 mt-2 mt-lg-0">
								<i className="bx bxs-plus-square"/>Add New User
							</NavLink>
						</div>
					</div>
					<div className="table-responsive">
						<table className="table mb-0">
							<thead className="table-light">
							<tr>
								<th>User #</th>
								<th>Name</th>
								<th>Status</th>
								<th>Role</th>
								<th>Date</th>
								<th>View Details</th>
								<th>Actions</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td>
									<div className="d-flex align-items-center">
										<div>
											<input className="form-check-input me-3" type="checkbox" value="" aria-label="..." />
										</div>
										<div className="ms-2">
											<h6 className="mb-0 font-14">#OS-000354</h6>
										</div>
									</div>
								</td>
								<td>Gaspur Antunes</td>
								<td>
									<div
										className="badge rounded-pill text-success bg-light-success p-2 text-uppercase px-3">
										<i className='bx bxs-circle me-1'/>FulFilled
									</div>
								</td>
								<td>$485.20</td>
								<td>June 10, 2020</td>
								<td>
									<button type="button" className="btn btn-primary btn-sm radius-30 px-4">View
										Details
									</button>
								</td>
								<td>
									<div className="d-flex order-actions">
										<NavLink to={'/users/edit/1'} className=""><i className='bx bxs-edit'/></NavLink>
										<NavLink to={'/users/remove/1'} className="ms-3"><i className='bx bxs-trash'/></NavLink>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className="d-flex align-items-center">
										<div>
											<input className="form-check-input me-3" type="checkbox" value="" aria-label="..."/>
										</div>
										<div className="ms-2">
											<h6 className="mb-0 font-14">#OS-000986</h6>
										</div>
									</div>
								</td>
								<td>Gaspur Antunes</td>
								<td>
									<div className="badge rounded-pill text-info bg-light-info p-2 text-uppercase px-3">
										<i className='bx bxs-circle align-middle me-1'/>Confirmed
									</div>
								</td>
								<td>$650.30</td>
								<td>June 12, 2020</td>
								<td>
									<button type="button" className="btn btn-primary btn-sm radius-30 px-4">View
										Details
									</button>
								</td>
								<td>
									<div className="d-flex order-actions">
										<Link to="/users/edit/1" className=""><i className='bx bxs-edit'/></Link>
										<Link to="/users/edit/1" className="ms-3"><i className='bx bxs-trash'/></Link>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className="d-flex align-items-center">
										<div>
											<input className="form-check-input me-3" type="checkbox" value="" aria-label="..." />
										</div>
										<div className="ms-2">
											<h6 className="mb-0 font-14">#OS-000536</h6>
										</div>
									</div>
								</td>
								<td>Gaspur Antunes</td>
								<td>
									<div
										className="badge rounded-pill text-warning bg-light-warning p-2 text-uppercase px-3">
										<i className='bx bxs-circle align-middle me-1' />Partially shipped
									</div>
								</td>
								<td>$159.45</td>
								<td>June 14, 2020</td>
								<td>
									<button type="button" className="btn btn-primary btn-sm radius-30 px-4">View
										Details
									</button>
								</td>
								<td>
									<div className="d-flex order-actions">
										<Link to="/users/edit/1" className=""><i className='bx bxs-edit' /></Link>
										<Link to="/users/edit/1" className="ms-3"><i className='bx bxs-trash' /></Link>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className="d-flex align-items-center">
										<div>
											<input className="form-check-input me-3" type="checkbox" value=""
												   aria-label="..." />
										</div>
										<div className="ms-2">
											<h6 className="mb-0 font-14">#OS-000678</h6>
										</div>
									</div>
								</td>
								<td>Gaspur Antunes</td>
								<td>
									<div
										className="badge rounded-pill text-success bg-light-success p-2 text-uppercase px-3">
										<i className='bx bxs-circle align-middle me-1' />FulFilled
									</div>
								</td>
								<td>$968.40</td>
								<td>June 16, 2020</td>
								<td>
									<button type="button" className="btn btn-primary btn-sm radius-30 px-4">View
										Details
									</button>
								</td>
								<td>
									<div className="d-flex order-actions">
										<Link to="/users/edit/1" className=""><i className='bx bxs-edit' /></Link>
										<Link to="/users/edit/1" className="ms-3"><i className='bx bxs-trash' /></Link>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className="d-flex align-items-center">
										<div>
											<input className="form-check-input me-3" type="checkbox" value=""
												   aria-label="..." />
										</div>
										<div className="ms-2">
											<h6 className="mb-0 font-14">#OS-000457</h6>
										</div>
									</div>
								</td>
								<td>Gaspur Antunes</td>
								<td>
									<div className="badge rounded-pill text-info bg-light-info p-2 text-uppercase px-3">
										<i className='bx bxs-circle align-middle me-1' />Confirmed
									</div>
								</td>
								<td>$689.50</td>
								<td>June 18, 2020</td>
								<td>
									<button type="button" className="btn btn-primary btn-sm radius-30 px-4">View
										Details
									</button>
								</td>
								<td>
									<div className="d-flex order-actions">
										<Link to="/users/edit/1" className=""><i className='bx bxs-edit' /></Link>
										<Link to="/users/edit/1" className="ms-3"><i className='bx bxs-trash' /></Link>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className="d-flex align-items-center">
										<div>
											<input className="form-check-input me-3" type="checkbox" value=""
												   aria-label="..." />
										</div>
										<div className="ms-2">
											<h6 className="mb-0 font-14">#OS-000685</h6>
										</div>
									</div>
								</td>
								<td>Gaspur Antunes</td>
								<td>
									<div className="badge rounded-pill text-info bg-light-info p-2 text-uppercase px-3">
										<i className='bx bxs-circle align-middle me-1' />Confirmed
									</div>
								</td>
								<td>$478.60</td>
								<td>June 20, 2020</td>
								<td>
									<button type="button" className="btn btn-primary btn-sm radius-30 px-4">View
										Details
									</button>
								</td>
								<td>
									<div className="d-flex order-actions">
										<Link to="/users/edit/1" className=""><i className='bx bxs-edit' /></Link>
										<Link to="/users/edit/1" className="ms-3"><i className='bx bxs-trash' /></Link>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className="d-flex align-items-center">
										<div>
											<input className="form-check-input me-3" type="checkbox" value=""
												   aria-label="..." />
										</div>
										<div className="ms-2">
											<h6 className="mb-0 font-14">#OS-000356</h6>
										</div>
									</div>
								</td>
								<td>Gaspur Antunes</td>
								<td>
									<div
										className="badge rounded-pill text-warning bg-light-warning p-2 text-uppercase px-3">
										<i className='bx bxs-circle align-middle me-1' />Partially shipped
									</div>
								</td>
								<td>$523.30</td>
								<td>June 21, 2020</td>
								<td>
									<button type="button" className="btn btn-primary btn-sm radius-30 px-4">View
										Details
									</button>
								</td>
								<td>
									<div className="d-flex order-actions">
										<Link to="/users/edit/1" className=""><i className='bx bxs-edit' /></Link>
										<Link to="/users/edit/1" className="ms-3"><i className='bx bxs-trash' /></Link>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className="d-flex align-items-center">
										<div>
											<input className="form-check-input me-3" type="checkbox" value=""
												   aria-label="..." />
										</div>
										<div className="ms-2">
											<h6 className="mb-0 font-14">#OS-000875</h6>
										</div>
									</div>
								</td>
								<td>Gaspur Antunes</td>
								<td>
									<div
										className="badge rounded-pill text-success bg-light-success p-2 text-uppercase px-3">
										<i className='bx bxs-circle align-middle me-1' />FulFilled
									</div>
								</td>
								<td>$960.20</td>
								<td>June 24, 2020</td>
								<td>
									<button type="button" className="btn btn-primary btn-sm radius-30 px-4">View
										Details
									</button>
								</td>
								<td>
									<div className="d-flex order-actions">
										<Link to="/users/edit/1" className=""><i className='bx bxs-edit' /></Link>
										<Link to="/users/edit/1" className="ms-3"><i className='bx bxs-trash' /></Link>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className="d-flex align-items-center">
										<div>
											<input className="form-check-input me-3" type="checkbox" value=""
												   aria-label="..." />
										</div>
										<div className="ms-2">
											<h6 className="mb-0 font-14">#OS-000658</h6>
										</div>
									</div>
								</td>
								<td>Gaspur Antunes</td>
								<td>
									<div
										className="badge rounded-pill text-success bg-light-success p-2 text-uppercase px-3">
										<i className='bx bxs-circle align-middle me-1' />FulFilled
									</div>
								</td>
								<td>$428.10</td>
								<td>June 25, 2020</td>
								<td>
									<button type="button" className="btn btn-primary btn-sm radius-30 px-4">View
										Details
									</button>
								</td>
								<td>
									<div className="d-flex order-actions">
										<Link to="/users/edit/1" className=""><i className='bx bxs-edit' /></Link>
										<Link to="/users/edit/1" className="ms-3"><i className='bx bxs-trash' /></Link>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className="d-flex align-items-center">
										<div>
											<input className="form-check-input me-3" type="checkbox" value=""
												   aria-label="..." />
										</div>
										<div className="ms-2">
											<h6 className="mb-0 font-14">#OS-000689</h6>
										</div>
									</div>
								</td>
								<td>Gaspur Antunes</td>
								<td>
									<div
										className="badge rounded-pill text-warning bg-light-warning p-2 text-uppercase px-3">
										<i className='bx bxs-circle align-middle me-1' />Partially shipped
									</div>
								</td>
								<td>$876.60</td>
								<td>June 26, 2020</td>
								<td>
									<button type="button" className="btn btn-primary btn-sm radius-30 px-4">View
										Details
									</button>
								</td>
								<td>
									<div className="d-flex order-actions">
										<Link to="/users/edit/1" className=""><i className='bx bxs-edit' /></Link>
										<Link to="/users/edit/1" className="ms-3"><i className='bx bxs-trash' /></Link>
									</div>
								</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default Users;