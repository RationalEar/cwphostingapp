import React, {useCallback, useEffect, useState} from "react";
import {Accordion, Alert, Card, Row, Spinner} from "react-bootstrap";
import LandlordHeaderButton from "./LandlordHeaderButton";
import {get_axios_error} from "../../../helpers/general";
import {setWarning} from "../../../features/notifications/NotificationSlice";
import {useDispatch} from "react-redux";
import {NavLink} from "react-router-dom";

function LandlordHeader() {
	const dispatch = useDispatch()
	const [fetched, setFetched] = useState(false)
	const [stats, setStats] = useState(null)
	
	const countProperties = useCallback(() => {
		setFetched(true)
		window.axios.get('properties/stats')
			.then(response=>{
				setStats(response.data)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
	},[dispatch])
	
	useEffect(()=>{
		if(!fetched){
			countProperties()
		}
	},[fetched, countProperties])
	
	return (
		<Accordion defaultActiveKey="0">
			<Card className="rounded-0">
				<Accordion.Collapse eventKey="0">
					<Card.Body>
						<Row className="row-cols-1 row-cols-md-2 row-cols-xl-4 py-3">
							
							<div className="col">
								<Card className="mb-0 radius-10">
									<Card.Body>
										<NavLink to={'/properties'} className="d-flex align-items-center">
											<div>
												<p className="mb-0 text-secondary">Properties</p>
												<h4 className="my-1">
													{stats===null? <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner> : stats.properties}
												</h4>
											</div>
											<div className="text-primary ms-auto font-35"><i className="bx bx-building-house"/></div>
										</NavLink>
									</Card.Body>
								</Card>
							</div>
							
							<div className="col">
								<Card className="mb-0 radius-10">
									<Card.Body>
										<NavLink to={'/leases'} className="d-flex align-items-center">
											<div>
												<p className="mb-0 text-secondary">Leases</p>
												<h4 className="my-1">
													{stats===null ? <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner> : stats.leases}
												</h4>
											</div>
											<div className="text-primary ms-auto font-35"><i className="bx bx-file"/></div>
										</NavLink>
									</Card.Body>
								</Card>
							</div>
							
							<div className="col">
								<Card className="mb-0 radius-10">
									<Card.Body>
										<div className="d-flex align-items-center">
											<div>
												<p className="mb-0 text-secondary">Unpaid Bills</p>
												<h4 className="my-1">
													{stats===null ? <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner> : stats.unpaidInvoices}
												</h4>
											</div>
											<div className="text-primary ms-auto font-35"><i className="bx bx-detail"/></div>
										</div>
									</Card.Body>
								</Card>
							</div>
							
							<div className="col">
								<Card className="mb-0 radius-10">
									<Card.Body>
										<div className="d-flex align-items-center">
											<div>
												<p className="mb-0 text-secondary">Approval Requests</p>
												<h4 className="my-1">
													{stats===null ? <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner> : stats.unconfirmedPayments}
												</h4>
											</div>
											<div className="text-primary ms-auto font-35"><i className="bx bx-badge-check"/></div>
										</div>
									</Card.Body>
								</Card>
							</div>
							
						</Row>
						{stats!==null && stats.properties===0 && <Row className="px-3">
							<Alert variant={'primary'}>
								<span className="fs-5">
									You have not registered any properties yet. <NavLink to={'/properties'} className={'alert-link'}>Go to Properties</NavLink> and add a new property.
								</span>
							</Alert>
						</Row>}
						{stats!==null && stats.properties>0 && stats.leases===0 && <Row className="px-3">
							<Alert variant={'primary'}>
								<span className="fs-5">
									You have not add any leases yet. <NavLink to={'/leases'} className={'alert-link'}>Go to Leases</NavLink> and add a new lease.
								</span>
							</Alert>
						</Row>}
					</Card.Body>
				</Accordion.Collapse>
				<div className={'position-relative'}>
					<LandlordHeaderButton eventKey="0" />
				</div>
			</Card>
		</Accordion>
	)
}

export default LandlordHeader