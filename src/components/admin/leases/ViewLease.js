import {Button, Card, Row, Table} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import {NavLink, useHistory, useParams} from "react-router-dom";
import Breadcrumbs from "../../misc/Breadcrumbs";
import {get_axios_error, leftPad} from "../../../helpers/general";
import {setWarning} from "../../../features/notifications/NotificationSlice";
import {useDispatch} from "react-redux";
import EditLease from "./EditLease";
import {PaymentSchedule, ShortDateString, ShortDateTime} from "./leaseFields";
import Pagination from "../../common/Pagination";
import PageLimit from "../../common/PageLimit";
import CreatePayment from "./CreatePayment";

function ViewLease(){
	const { id } = useParams();
	const [lease, setLease] = useState()
	const [invoices, setInvoices] = useState([])
	const [fetched, setFetched] = useState(false)
	const [invoicesFetched, setInvoicesFetched] = useState(false)
	const [pageCount, setPageCount] = useState(0)
	const [pageLimit, setPageLimit] = useState( 10 )
	const [pageOffset, setPageOffset] = useState( 0)
	const [totalItems, setTotalItems] = useState(0)
	const [options, setOptions] = useState([])
	const [optionsFetched, setOptionsFetched] = useState(false)
	const dispatch = useDispatch()
	const history = useHistory();
	const [currentInvoice, setCurrentInvoice] = useState()
	
	const [show, setShow] = useState(false)
	const [modal, setModal] = useState('')
	
	const handleClose = () => {
		setModal('')
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
	
	const recordPayment = (invoice) => {
		setCurrentInvoice(invoice)
		setModal('record')
		setShow(true)
		return false
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
	
	const getLeaseInvoices = useCallback(()=>{
		const params = { page: pageOffset, limit: pageLimit}
		window.axios.get('/lease/'+id+'/invoices', {params: params})
			.then(response=>{
				setInvoices(response.data.items)
				setInvoicesFetched(true)
				setPageCount(response.data.totalPages)
				const currentPage = response.data.currentPage <= response.data.totalPages ? response.data.currentPage : 0
				setPageOffset(currentPage)
				setTotalItems(response.data.totalItems)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
	},[dispatch, id, pageLimit, pageOffset])
	
	const getLeaseOptions = useCallback(()=>{
		setOptionsFetched(true)
		window.axios.get("lease/config")
			.then(response=>{
				setOptions(response.data)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
		
	},[dispatch])
	
	const handlePageClick = (event) => {
		setPageOffset(event.selected)
		setInvoicesFetched(false)
	}
	
	const updatePageLimit = (l) => {
		setPageLimit(l)
		setInvoicesFetched(false)
	}
	
	useEffect(()=>{
		if(!fetched && id){
			getLease()
		}
		if(!invoicesFetched && id){
			getLeaseInvoices()
		}
		if(!optionsFetched){
			getLeaseOptions()
		}
	},[fetched, getLease, getLeaseInvoices, getLeaseOptions, id, invoicesFetched, options.length, optionsFetched])
	
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
	
	const PaymentModal = function (){
		if(currentInvoice && lease){
			return (
				modal==='record' ? <CreatePayment invoice={currentInvoice} lease={lease} onHide={handleClose}
												  show={show} onRefresh={()=>setInvoicesFetched(false)}
												  currencies={options.currencies} paymentMethods={options.paymentMethods} /> : null
			)
		}
		else return null
	}
	
	const StatusPill = (props) => {
		const inv = props.invoice
		const today = new Date()
		const fullyPaidDate = inv.fullyPaidDate ? new Date(inv.fullyPaidDate) : false
		const dueDate = new Date(inv.invoiceDueDate)
		if( inv.amountPaid === 0 && inv.amountDue>0 && today<=dueDate ) {
			return (
				<span className="badge rounded-pill text-dark bg-warning p-2 text-uppercase">
					<i className='bx bxs-circle me-1'/> Due
				</span>
			)
		}
		else if( inv.amountPaid>0 && inv.invoiceAmount > inv.amountPaid && today<=dueDate ){
			return (
				<span className="btn badge rounded-pill text-warning bg-light-warning p-2 text-uppercase">
					<i className='bx bxs-circle me-1'/> Partially Paid
				</span>
			)
		}
		else if( inv.invoiceAmount > inv.amountPaid && today>dueDate ){
			return (
				<span className="btn badge rounded-pill text-danger bg-light-danger p-2 text-uppercase">
					<i className='bx bxs-circle me-1'/> Overdue
				</span>
			)
		}
		else if( inv.invoiceAmount <= inv.amountPaid && fullyPaidDate && fullyPaidDate<=dueDate ){
			return (
				<span className="btn badge rounded-pill text-success bg-light-success p-2 text-uppercase" title={fullyPaidDate.toLocaleString()}>
					<i className='bx bxs-circle me-1'/> Paid
				</span>
			)
		}
		else if( inv.invoiceAmount <= inv.amountPaid && fullyPaidDate && fullyPaidDate>dueDate ){
			return (
				<span className="btn badge rounded-pill text-dark bg-light-danger p-2 text-uppercase" title={fullyPaidDate.toLocaleString()}>
					<i className='bx bxs-circle me-1'/> Paid Late
				</span>
			)
		}
		else return (
			<span className="btn badge rounded-pill text-danger bg-light-danger p-2 text-uppercase" title={'Try adding a payment of 0.00 to fix data error'}>
				<i className='bx bxs-circle me-1'/>
				Data Error
			</span>
		)
	}
	
	if(fetched && lease) {
		const property = lease.property
		const tenant = lease.tenant
		return (
			<React.Fragment>
				<Breadcrumbs category={'Lease Management'} title={'View Lease'} links={[{to:'/leases', title:'Leases'}]}>
					<Button type={'button'} variant={'outline-secondary'} onClick={history.goBack}>Back</Button>
				</Breadcrumbs>
				<Row>
					<div className={'col-sm-6'}>
						<Card>
							<Card.Header>
								<Card.Title className="mb-0 mt-1">
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
											<span className="text-secondary"><ShortDateTime date={lease.created}/></span>
										</li>
										<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
											<h6 className="mb-0">Last Invoice Date</h6>
											<span className="text-secondary"><ShortDateTime date={lease.lastInvoiceDate}/></span>
										</li>
										<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
											<h6 className="mb-0">Lease Status</h6>
											<span className="text-secondary">{lease.status}</span>
										</li>
										<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
											<h6 className="mb-0">Payment Schedule</h6>
											<span className="text-secondary text-end">
												<PaymentSchedule lease={lease} />
											</span>
										</li>
										<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
											&nbsp;
										</li>
									</ul>
								</div>
							</Card.Body>
						</Card>
					</div>
					<div className={'col-sm-6'}>
						<Card>
							<Card.Header>
								<Row>
									<div className={'col-5'}>
										<Card.Title className="mb-0 mt-1">Billing History</Card.Title>
									</div>
									<div className={'col-7 align-content-end text-end'}>
										<PageLimit setPageLimit={updatePageLimit} pageLimit={pageLimit} size={'sm'}/>
									</div>
								</Row>
							</Card.Header>
							<Card.Body>
								<div className="table-responsive">
									<Table className={'mb-0'}>
										<thead>
											<tr>
												<th>Billing Date</th>
												<th>Due Date</th>
												<th>Amount Due</th>
												<th>Amount Paid</th>
												<th>Status</th>
												{/*<th>Actions</th>*/}
											</tr>
										</thead>
										<tbody>
											{invoices.map( invoice =>{
												const d = new Date(invoice.invoiceDate)
												return(
													<tr key={invoice.id}>
														<td>
															<NavLink to={'/admin/rent-invoice/'+invoice.id}>
																<ShortDateString date={invoice.invoiceDate}/>
																{lease.paymentSchedule.cycle==='HOUR' && ' ['+leftPad(d.getHours(),2)+']'}
															</NavLink>
														</td>
														<td><ShortDateString date={invoice.invoiceDueDate}/></td>
														<td>
															<Button variant={"link"} size={"sm"} className="text-decoration-none m-0 p-0"
																	onClick={()=>recordPayment(invoice)} title="Click to record payment">
																{invoice.currency} {Number(invoice.amountDue).toFixed(2)}
															</Button>
														</td>
														<td>{invoice.currency} {Number(invoice.amountPaid).toFixed(2)}</td>
														<td>
															<NavLink to={'/admin/rent-invoice/'+invoice.id}>
																<StatusPill invoice={invoice} />
															</NavLink>
														</td>
														{/*<td>
															<div className={'d-flex order-actions'}>
																{invoice.amountPaid<invoice.invoiceAmount ?
																	<Button variant={"primary"} size={"sm"} className={'m-0 pb-0'} title={'Add payment'}>
																		<span className="bx bx-plus-medical"/></Button>
																	: <Button variant={"danger"} size={"sm"} className={'m-0 pb-0'} title={'Delete payment'}><span className="bx bx-trash"/></Button>}
															</div>
														</td>*/}
													</tr>
												)
											} )}
										</tbody>
									</Table>
								</div>
								{pageCount>0?<Pagination
									handlePageClick={handlePageClick}
									pageCount={pageCount} pageLimit={pageLimit} pageOffset={pageOffset}
									totalItems={totalItems} currentItems={invoices.length}
								/>:null}
							</Card.Body>
						</Card>
					</div>
				</Row>
				<EditModal />
				<PaymentModal />
				<div className={'align-content-end text-end mt-5'}>
					<Button type={'button'} variant={'outline-secondary'} onClick={history.goBack}>Back</Button>
				</div>
			</React.Fragment>
		)
	}
	else return (
		<React.Fragment>
			<Breadcrumbs category={'Lease Management'} title={'View Lease'}>
				<Button type={'button'} variant={'outline-secondary'} onClick={history.goBack}>Back</Button>
			</Breadcrumbs>
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