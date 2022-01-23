import React from "react";
import {Button, Table} from "react-bootstrap";
import Breadcrumbs from "../../../misc/Breadcrumbs";
import {useHistory} from "react-router-dom";

function RentInvoice(props){
	const history = useHistory()
	
	const printWindow = () => {
		window.print()
	}
	
	return (
		<React.Fragment>
			<Breadcrumbs category={'Lease Management'} title={'View Rent Invoice'}>
				<Button type={'button'} variant={'outline-secondary'} onClick={history.goBack}>Back</Button>
			</Breadcrumbs>
			
			<div className="card">
				<div className="card-body">
					<div id="invoice">
						<div className="toolbar hidden-print">
							<div className="text-end">
								<button type="button" onClick={printWindow} className="btn btn-dark me-2"><i className="fa fa-print"/> Print</button>
								<button type="button" className="btn btn-danger"><i className="fa fa-file-pdf-o"/> Export as PDF</button>
							</div>
							<hr/>
						</div>
						<div className="invoice overflow-auto">
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
												<span>Arboshiki</span>
											</h2>
											<div>455 Foggy Heights, AZ 85004, US</div>
											<div>(123) 456-789</div>
											<div>company@example.com</div>
										</div>
									</div>
								</header>
								<main>
									<div className="row contacts">
										<div className="col invoice-to">
											<div className="text-gray-light">INVOICE TO:</div>
											<h2 className="to">John Doe</h2>
											<div className="address">796 Silver Harbour, TX 79273, US</div>
											<div className="email">
												<a target="_blank" href="mailto:john@example.com" rel="noreferrer">john@example.com</a>
											</div>
										</div>
										<div className="col invoice-details">
											<h1 className="invoice-id">INVOICE 3-2-1</h1>
											<div className="date">Date of Invoice: 01/10/2018</div>
											<div className="date">Due Date: 30/10/2018</div>
										</div>
									</div>
									<h3>Payments</h3>
									<Table className={'table-borderless'}>
										<thead>
										<tr className={'text-dark'}>
											<th>#</th>
											<th className="text-left">DATE</th>
											<th className="text-left">COMMENT</th>
											<th className="text-right">AMOUNT</th>
											<th className="text-right">TOTAL</th>
										</tr>
										</thead>
										<tbody>
										<tr>
											<td className="">01</td>
											<td className="text-left">
												Rent per week
											</td>
											<td className="">$150.00</td>
											<td className="">$0.00</td>
										</tr>
										</tbody>
										<tfoot>
										<tr>
											<td colSpan="2"/>
											<td colSpan="1">Invoice Total</td>
											<td>$5,200.00</td>
										</tr>
										<tr>
											<td colSpan="2"/>
											<td colSpan="1">Amount Paid</td>
											<td>$1,300.00</td>
										</tr>
										<tr>
											<td colSpan="2"/>
											<td colSpan="1">Amount Due</td>
											<td>$6,500.00</td>
										</tr>
										</tfoot>
									</Table>
									<div className="thanks">Thank you!</div>
									<div className="notices">
										<div>NOTICE:</div>
										<div className="notice">A finance charge of 1.5% will be made on unpaid balances
											after 30 days.
										</div>
									</div>
								</main>
								<footer>Invoice was created on a computer and is valid without the signature and seal.
								</footer>
							</div>
							
							<div />
						</div>
					</div>
				</div>
			</div>
			
		</React.Fragment>
	)
}

export default RentInvoice