import React, {useState} from "react";
import { useParams} from "react-router-dom";
import Search from "./Search";
import {Card, Col, Row} from "react-bootstrap";
import OrderForm from "./OrderForm";
import TenantSummary from "./TenantSummary";

function BuyReport(){
	const {id} = useParams()
	const [user, setUser] = useState(null)
	
	if(id) return (
		<Row className="row-cols-1 row-cols-2">
			<Col>
				<TenantSummary id={id} tenantReady={setUser} showReportButtons={true} />
			</Col>
			<Col>
				<Card className="border-top border-0 border-4 border-danger">
					<Card.Body className="p-3">
						{user && <OrderForm id={id} tenant={user}/>}
						{!user && <div className="m-5 py-5">Loading tenant details, please wait...</div>}
					</Card.Body>
				</Card>
			</Col>
		</Row>
	)
	else return (
		<Search />
	)
}

export default BuyReport