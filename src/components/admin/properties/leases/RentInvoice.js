import React, {useCallback, useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import Breadcrumbs from "../../../misc/Breadcrumbs";
import {useHistory, useParams} from "react-router-dom";
import {ShortDateString} from "./leaseFields";
import CreatePayment from "./CreatePayment";
import {setInfo, setWarning} from "../../../../features/notifications/NotificationSlice";
import {useDispatch} from "react-redux";
import {get_axios_error} from "../../../../helpers/general";

function RentInvoice(){
	const { id } = useParams();
	const history = useHistory()
	const dispatch = useDispatch()
	const [fetched, setFetched] = useState(false)
	const [invoice, setInvoice] = useState()
	const [lease, setLease] = useState()
	const [payments, setPayments] = useState([])
	const [currencies, setCurrencies] = useState([])
	const [paymentMethods, setPaymentMethods] = useState([])
	const [show, showModal] = useState(false)
	const [modal, setModal] = useState('')
	
	const getInvoice = useCallback(()=>{
		if(id){
			window.axios.get('/rent-invoice/'+id)
				.then(response => {
					setInvoice(response.data.invoice)
					setLease(response.data.lease)
					setPayments(response.data.payments)
					setCurrencies(response.data.currencies)
					setPaymentMethods(response.data.paymentMethods)
					setFetched(true)
				})
		}
	},[id])
	
	const confirmPayment = (payment) => {
		const confirm = window.confirm("Are you sure you want to CONFIRM the payment of "+payment.currency+' '+Number(payment.amount).toFixed(2))
		if (confirm){
			window.axios.put('/rent-invoice/'+id+'/confirm-payment', payment)
				.then(response => {
					dispatch(setInfo(response.data.message))
					setFetched(false)
				})
				.catch((error) => {
					const e = get_axios_error(error)
					dispatch(setWarning(e.message))
				})
		}
	}
	
	const deletePayment = (payment) => {
		const confirm = window.confirm("Are you sure you want to DELETE the payment of "+payment.currency+' '+Number(payment.amount).toFixed(2))
		if (confirm){
			window.axios.delete('/rent-invoice/payment/'+payment.id, payment)
				.then(response => {
					dispatch(setInfo(response.data.message))
					setFetched(false)
				})
				.catch((error) => {
					const e = get_axios_error(error)
					dispatch(setWarning(e.message))
				})
		}
	}
	
	useEffect(()=>{
		if (!fetched){
			getInvoice()
		}
	},[fetched, getInvoice])
	
	const handleClose = () => {
		setModal('')
		showModal(false)
	}
	
	const recordPayment = () => {
		setModal('record')
		showModal(true)
	}
	
	const onRefresh = () => {
		setFetched(false)
	}
	
	const PaymentModal = function (){
		if(invoice && lease){
			return (
				modal==='record' ? <CreatePayment invoice={invoice} lease={lease} onHide={handleClose}
												  show={show} onRefresh={onRefresh}
												  currencies={currencies} paymentMethods={paymentMethods} /> : null
			)
		}
		else return null
	}
	
	if(fetched && invoice){
		const links = [
			{ to: '/leases', title:'Leases' },
			{ to: '/leases/'+invoice.leaseId, title: 'View Lease' }
		]
		const owner = lease && lease.property && lease.property.owner ? lease.property.owner : null
		const address = lease && lease.property && lease.property.address ? lease.property.address : null
		const tenant = lease && lease.tenant ? lease.tenant : null
		// const confirmedPayments = payments.filter( payment => payment.confirmed )
		//const amountPaid = confirmedPayments.reduce((acc, payment) => acc + (payment.amount*payment.exchangeRate), 0)
		// const unConfirmedPayments = payments.filter( payment => !payment.confirmed )
		let i = 0;
		return (
			<React.Fragment>
				<Breadcrumbs category={'Lease Management'} title={'View Rent Invoice'} links={links} >
					<Button type={'button'} variant={'outline-secondary'} className={'me-2'} onClick={()=>setFetched(false)} title="Refresh Payments">
						<span className="bx bx-revision fw-bold" />
					</Button>
					<Button type={'button'} variant={'primary'} className={'me-2'} onClick={recordPayment}>Record Payment</Button>
					<Button type={'button'} variant={'outline-secondary'} onClick={history.goBack}>Back</Button>
				</Breadcrumbs>
				
				<div className="card">
					<div className="card-body">
						<div id="invoice">
							<div className="invoice overflow-auto pt-0">
								<div style={{minWidth: "600px"}}>
									<header>
										<div className="row">
											<div className="col">
											<span>
												<img src={"/assets/images/avatars/property-icon.jpg"} width="80" alt=""/>
											</span>
											</div>
											<div className="col company-details">
												<h2 className="name">
													{owner && <span>{owner.firstName} {owner.lastName}</span>}
												</h2>
												{owner && owner.address && <div>{owner.address.addressLine1} {owner.address.addressLine2}<br/>{owner.address.city}, {owner.address.country}</div>}
												{owner && <div>{owner.phoneNumber}</div>}
												{owner && <div>{owner.email}</div>}
											</div>
										</div>
									</header>
									<main>
										<div className="row contacts">
											<div className="col invoice-to">
												<div className="text-gray-light">LESSEE</div>
												{tenant && <h2 className="to">{tenant.firstName} {tenant.lastName}</h2>}
												{address && <div className="address">{address.addressLine1} {address.addressLine2}<br/>{address.city}, {address.country}</div>}
												<div className="email">{tenant && <span>{tenant.phoneNumber}</span>}</div>
												<div className="email">{tenant && <span>{tenant.email}</span>}</div>
											</div>
											<div className="col invoice-details">
												<h2 className="invoice-id text-uppercase">{invoice.id.substr(0,13)}</h2>
												<div className="date">Invoice Date: <ShortDateString date={invoice.invoiceDate} /></div>
												<div className="date">Due Date: <ShortDateString date={invoice.invoiceDueDate} /></div>
												<div className="date">Invoice Amount: {invoice.currency} {Number(invoice.invoiceAmount).toFixed(2)}</div>
											</div>
										</div>
										<br/>
										<hr/>
										<br/>
										<h3>Payments</h3>
										<Table className={'table-borderless'}>
											<thead>
											<tr className={'text-dark'}>
												<th />
												<th>#</th>
												<th className="text-start">DATE</th>
												<th className="text-start">POSTED BY</th>
												<th className="text-start">COMMENT</th>
												<th className="text-end">AMOUNT</th>
												<th className="text-end">TOTAL ({invoice.currency})</th>
											</tr>
											</thead>
											<tbody>
											{payments.map(payment=>{
												return(
													<tr key={payment.id}>
														<td>
															<Button variant={'danger'} size={'sm'} title="Delete payment" onClick={()=>deletePayment(payment)}
																className="px-1 py-0">
																<span className={'bx bxs-trash fw-bold'}/>
															</Button>
														</td>
														<td className="">{++i}</td>
														<td className=""><ShortDateString date={payment.paymentDate} /></td>
														<td className="">{payment.postedBy.firstName} {payment.postedBy.lastName}</td>
														<td className="text-start">{payment.comment}</td>
														<td className="text-end">{payment.currency} {Number(payment.amount).toFixed(2)}</td>
														<td className="text-end">
															{payment.confirmed &&
															( payment.currency===invoice.currency ? Number(payment.amount).toFixed(2) :
																	(payment.amount/payment.exchangeRate).toFixed(2)
															)
															}
															{!payment.confirmed && <div>
																<Button variant={'success'} size={'sm'} className="me-3" title="Confirm payment"
																		onClick={()=>confirmPayment(payment)}>
																	<span className={'bx bx-like fw-bold'}/>
																</Button>
															</div>}
														</td>
													</tr>
												)
											})}
											</tbody>
											<tfoot>
											<tr>
												<td colSpan="5"/>
												<td colSpan="1">Invoice Total</td>
												<td>{Number(invoice.invoiceAmount).toFixed(2)}</td>
											</tr>
											<tr>
												<td colSpan="5"/>
												<td colSpan="1">Amount Paid</td>
												<td>{Number(invoice.amountPaid).toFixed(2)}</td>
											</tr>
											<tr>
												<td colSpan="5"/>
												<td colSpan="1">Amount Due</td>
												<td>{Number(invoice.amountDue).toFixed(2)}</td>
											</tr>
											</tfoot>
										</Table>
										
										<div className="notices">
											<div>NOTICES:</div>
											{/*<div className="notice">A finance charge of 1.5% will be made on unpaid balances
											after 30 days.
										</div>*/}
										</div>
									</main>
									{/*<footer>Invoice was created on a computer and is valid without the signature and seal.</footer>*/}
								</div>
								
								<div />
							</div>
						</div>
					</div>
				</div>
				<PaymentModal />
				<div className={'align-content-end text-end mt-5'}>
					<Button type={'button'} variant={'outline-secondary'} onClick={history.goBack}>Back</Button>
				</div>
			</React.Fragment>
		)
	}
	else return (
		<React.Fragment>
			<Breadcrumbs category={'Lease Management'} title={'View Rent Invoice'} links={[{ to: '/leases', title:'Leases' }]}>
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

export default RentInvoice