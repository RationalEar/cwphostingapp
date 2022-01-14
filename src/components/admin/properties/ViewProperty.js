import {Button, Modal} from "react-bootstrap";
import React from "react";

function ViewProperty(props){
	const property = props.property
	return (
		<Modal size="lg" show={props.show} onHide={props.onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{property.name}</Modal.Title>
			</Modal.Header>
			<Modal.Body className="p-0 m-0">
				<div className="px-3">
						<div className="d-flex flex-column align-items-center text-center">
							<img src={'/assets/images/avatars/property-icon.jpg'} alt="Admin" className="rounded-circle p-1 bg-primary" width="110" />
							<div className="mt-3">
								<h4>{property.name}</h4>
								<p className="text-secondary mb-1">
									{property.address ? property.address.addressLine1 : ''}{property.address && property.address.addressLine2?', ':''}
									{property.address ? property.address.addressLine2 : ''}
								</p>
								{property.address.city || property.address.country ?
									<p className="text-secondary mb-1">{property.address.city}{(property.address.city && property.address.country) && ',' } {property.address.country}</p> : null}
								<button className="btn btn-outline-primary mb-2" onClick={() => props.editProperty(property)}>
									<i className="bx bx-edit"/> Edit
								</button>
								&nbsp;&nbsp;&nbsp;
								<button className="btn btn-outline-primary mb-2"><i className="bx bxs-envelope"/> Message Owner / Agent</button>
							</div>
						</div>
						<hr className="my-4" />
						<ul className="list-group list-group-flush">
							<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
								<h6 className="mb-0">Owner</h6>
								<span className="text-secondary">
									{property.owner && property.owner.firstName+' '+property.owner.lastName}
								</span>
							</li>
							<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
								<h6 className="mb-0">Contact</h6>
								<span className="text-secondary">
									{property.owner && <span>
										{property.owner.phoneNumber && property.owner.phoneNumber} &nbsp;
										{property.owner.email && property.owner.email}
									</span> }</span>
							</li>
							<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
								<h6 className="mb-0">Created</h6>
								<span className="text-secondary">{property.created}</span>
							</li>
							<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
								<h6 className="mb-0">Property Status</h6>
								<span className="text-secondary">{property.status}</span>
							</li>
							<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
								<h6 className="mb-0">Recent Tenants</h6>
								<span className="text-secondary">N/A</span>
							</li>
							<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
								&nbsp;
							</li>
						</ul>
				</div>
			</Modal.Body>
			<Modal.Footer style={{borderTop:'none'}}>
				<Button variant="secondary" onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default ViewProperty