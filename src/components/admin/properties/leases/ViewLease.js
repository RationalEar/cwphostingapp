import {Button, Card, Row} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import Breadcrumbs from "../../../misc/Breadcrumbs";
import {get_axios_error} from "../../../../helpers/general";
import {setWarning} from "../../../../features/notifications/NotificationSlice";
import {useDispatch} from "react-redux";
import EditLease from "./EditLease";

function ViewLease(){
	const { id } = useParams();
	const [lease, setLease] = useState()
	const [fetched, setFetched] = useState(false)
	const dispatch = useDispatch()
	const history = useHistory();
	
	const [show, setShow] = useState(false)
	const [modal, setModal] = useState('')
	
	const handleClose = () => {
		setShow(false)
	}
	const handleShow = () => setShow(true)
	
	const editLease = (u) => {
		setModal('edit')
		setLease(u)
		handleShow(true)
	}
	
	const onUpdateLease = u => {
		setLease(u)
	}
	
	const getLease = useCallback(()=>{
		window.axios.get('/lease/'+id)
			.then(response=>{
				setLease(response.data)
				setFetched(true)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
	},[dispatch, id])
	
	useEffect(()=>{
		if(!fetched && id){
			getLease()
		}
	},[fetched, getLease, id])
	
	const EditModal = function (){
		if(lease){
			if(lease.property.address===null){
				lease.property.address = {
					addressLine1: '', addressLine2: '', city: '', country: '', postcode: ''
				}
			}
			return (
				modal==='edit' ? <EditLease lease={lease} onHide={handleClose} show={show} updateLease={onUpdateLease} leaseOptions={false} /> : null
			)
		}
		else return null
	}
	
	if(fetched && lease) {
		const property = lease.property
		const tenant = lease.tenant
		return (
			<React.Fragment>
				<Breadcrumbs category={'Lease Management'} title={'View Lease'} />
				<Row>
					<div className={'col-sm-7'}>
						<Card>
							<Card.Header>
								<Card.Title>
									{property.address ? property.address.addressLine1 : ''}{property.address && property.address.addressLine2 ? ', ' : ''}
									{property.address ? property.address.addressLine2 : ''}
									&nbsp;
									{property.address.city}
								</Card.Title>
							</Card.Header>
							<Card.Body className="p-0 m-0">
								<div className="px-3">
									<div className="d-flex flex-column align-items-center text-center">
										<img src={'/assets/images/avatars/property-icon.jpg'} alt="Lease"
											 className="rounded-circle p-1 bg-primary" width="110"/>
										<div className="mt-3">
											<h4>{tenant.firstName} {tenant.lastName}</h4>
											<p className="text-secondary mb-1">
												{property.address ? property.address.addressLine1 : ''}{property.address && property.address.addressLine2 ? ', ' : ''}
												{property.address ? property.address.addressLine2 : ''}
											</p>
											{property.address.city || property.address.country ?
												<p className="text-secondary mb-1">{property.address.city}{(property.address.city && property.address.country) && ','} {property.address.country}</p> : null}
											<button className="btn btn-outline-primary mb-2"
													onClick={() => editLease(lease)}>
												<i className="bx bx-edit"/> Edit
											</button>
											&nbsp;&nbsp;&nbsp;
											<button className="btn btn-outline-primary mb-2"><i
												className="bx bxs-envelope"/> Message Tenant
											</button>
											&nbsp;&nbsp;&nbsp;
											<button className="btn btn-outline-primary mb-2"><i
												className="bx bxs-envelope"/> Message Owner / Agent
											</button>
										</div>
									</div>
									<hr className="my-4"/>
									<ul className="list-group list-group-flush">
										<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
											<h6 className="mb-0">Property Owner</h6>
											<span className="text-secondary">
										{property.owner && property.owner.firstName + ' ' + property.owner.lastName}
									</span>
										</li>
										<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
											<h6 className="mb-0">Owner Contact</h6>
											<span className="text-secondary">
										{property.owner && <span>
											{property.owner.phoneNumber && property.owner.phoneNumber} &nbsp;
											{property.owner.email && property.owner.email}
										</span>}</span>
										</li>
										<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
											<h6 className="mb-0">Created</h6>
											<span className="text-secondary">{lease.created}</span>
										</li>
										<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
											<h6 className="mb-0">Lease Status</h6>
											<span className="text-secondary">{lease.status}</span>
										</li>
										<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
											<h6 className="mb-0">Rent Amount</h6>
											<span className="text-secondary">{lease.currency} {lease.amount}</span>
										</li>
										<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
											<h6 className="mb-0">Payment Every</h6>
											<span className="text-secondary">{lease.paymentSchedule.cycle}</span>
										</li>
										<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
											&nbsp;
										</li>
									</ul>
								</div>
							</Card.Body>
							<Card.Footer style={{borderTop: 'none'}} className={'align-content-end'}>
								<Button type={'button'} variant={'outline-secondary'} onClick={history.goBack}>Back</Button>
							</Card.Footer>
						</Card>
					</div>
					<div className={'col-sm-5'}>
						<Card>
							<Card.Header>
								<Card.Title>Payments</Card.Title>
							</Card.Header>
							<Card.Body>
								Coming soon
							</Card.Body>
						</Card>
					</div>
				</Row>
				<EditModal />
			</React.Fragment>
		)
	}
	else return (
		<React.Fragment>
			<Breadcrumbs category={'Lease Management'} title={'View Lease'} />
			<div className={'card'}>
				<div className={'card-body'}>
					<h4>loading, please wait...</h4>
					<p>{id}</p>
				</div>
			</div>
		</React.Fragment>
	)
}

export default ViewLease