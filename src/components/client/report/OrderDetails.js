import React, {useCallback, useEffect, useState} from "react";
import { useParams} from "react-router-dom";
import Search from "./Search";
import {Button, Card, Col, Row, Table} from "react-bootstrap";
import TenantSummary from "./TenantSummary";
import {get_axios_error} from "../../../helpers/general";
import {setWarning} from "../../../features/notifications/NotificationSlice";
import {useDispatch} from "react-redux";
import Breadcrumbs from "../../misc/Breadcrumbs";
import {ShortDateTime} from "../../admin/leases/leaseFields";
import RetryPayment from "./RetryPayment";

function OrderDetails(){
	const {id} = useParams()
	const dispatch = useDispatch()
	const [order, setOrder] = useState()
	const [fetched, setFetched] = useState(false)
	const [retryPayment, setRetryPayment] = useState(false)
	
	const getOrder = useCallback(()=>{
		window.axios.get('orders/'+id)
			.then(response=>{
				setOrder(response.data)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
			.finally(()=>{
				setFetched(true)
			})
	},[dispatch, id])
	
	useEffect(()=>{
		if(!fetched){
			getOrder(id)
		}
	},[id, fetched, getOrder])
	
	const orderStatusColor = (status) => {
		let color = ''
		switch (status) {
			case 'PENDING':
			case 'AWAITING_PAYMENT': color = 'warning'
				break
			case 'PROCESSING': color = 'info'
				break
			case 'ACTIVE' : color = 'primary'
				break
			case 'COMPLETE': color = 'success'
				break
			case 'EXPIRED' :
			case 'CANCELLED':
			case 'FAILED': color = 'danger'
				break
			default: color = 'secondary'
		}
		return color
	}
	
	const RetryPaymentButton = ({order}) => {
		if( (!order.status || ['PENDING', 'AWAITING_PAYMENT'].includes(order.status) ) && order.amountPaid < order.amount ) {
			return <Button variant={"danger"} size={"sm"} className="float-end" onClick={()=>setRetryPayment(true)}>Make Payment</Button>
		}
		else return null;
	}
	
	if(id) return (
		<React.Fragment>
			<Breadcrumbs category={'Order Details'} title={'Order '+id.substr(0, 8)} links={[{to:'/orders', title:'My Orders'}]}/>
			<Row className="row-cols-1 row-cols-2">
				<Col  xs={12} md={6}>
					{order && <TenantSummary id={order.tenantId} orderStatus={order.status} token={order.reportToken} tenantReady={false}/>}
				</Col>
				<Col xs={12} md={6}>
					{order && <Card className={"border-top border-0 border-4 border-" + orderStatusColor(order.status)}>
						<Card.Header>
							<Card.Title>Order Details</Card.Title>
						</Card.Header>
						<Card.Body className="p-3">
							<Table className="table-condensed">
								<thead>
								<tr><th colSpan={2}>Your Details</th></tr>
								</thead>
								<tbody>
								<tr>
									<th>Name</th><td>{order.user.firstName} {order.user.lastName}</td>
								</tr>
								<tr>
									<th>Date</th><td><ShortDateTime date={order.created} /></td>
								</tr>
								<tr>
									<th>Status</th><td>{order.status}</td>
								</tr>
								<tr>
									<th>Payment Method</th><td>{order.paymentMethod}</td>
								</tr>
								<tr>
									<th>Order Total</th><td>{order.currency} {Number(order.amount).toFixed(2)}</td>
								</tr>
								<tr>
									<th>Amount Paid</th><td>{order.currency} {Number(order.amountPaid).toFixed(2)}</td>
								</tr>
								<tr>
									<th>Amount Due</th>
									<td>
										{order.currency} {Number(order.amountDue).toFixed(2)} <RetryPaymentButton order={order} />
									</td>
								</tr>
								{retryPayment && <tr>
									<td colSpan={2}>
										<RetryPayment order={order} />
									</td>
								</tr>}
								</tbody>
							</Table>
						</Card.Body>
					</Card>}
				</Col>
			</Row>
		</React.Fragment>
	)
	else return (
		<Search />
	)
}

export default OrderDetails