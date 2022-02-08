import React, {useCallback, useEffect, useRef, useState} from "react";
import {Card, Spinner} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {generatePdf, get_axios_error} from "../../../helpers/general";
import {setWarning} from "../../../features/notifications/NotificationSlice";
import ReportPreview from "../../admin/leases/ReportPreview";
import ReportFrame from "../../admin/leases/ReportFrame";
import {pdfStyles} from "../../admin/leases/pdfStyles";

const TenantSummary = ({id, orderStatus, token, tenantReady, showReportButtons}) => {
	const pdfRef = useRef(null)
	const dispatch = useDispatch()
	const [user, setUser] = useState(null)
	const [summary, setSummary] = useState(null)
	const [fetched, setFetched] = useState(false)
	const [download, setDownload] = useState(false)
	
	const [show, setShow] = useState(false)
	const [modal, setModal] = useState('')
	
	const handleClose = () => {
		setModal('')
		setShow(false)
	}
	
	const downloadPdf = () => {
		generatePdf(pdfRef, id)
		setTimeout(closeDownload, 3000)
	}
	
	const closeDownload = () => {
		setDownload(false)
	}
	
	const getSummary = useCallback(()=>{
		window.axios.get('report/tenant-summary/'+id)
			.then(response=>{
				setUser(response.data.tenant)
				setSummary(response.data)
				if(tenantReady) tenantReady(response.data.tenant)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
			.finally(()=>{
				setFetched(true)
			})
	},[dispatch, id, tenantReady])
	
	const previewReport = () => {
		setModal('report')
		setShow(true)
		return false
	}
	
	useEffect(()=>{
		if(!fetched){
			getSummary()
		}
	},[fetched, getSummary])
	
	const ReportModal = function (){
		if(id) {
			return (
				modal === 'report' ? <ReportPreview onHide={handleClose} show={show} tenantId={id} token={token}/> : null
			)
		}
		else return null
	}
	
	return (
		<Card className="border-top border-0 border-4 border-primary">
			<Card.Header>
				{user ? <Card.Title>{user.firstName} {user.lastName}</Card.Title> : <Card.Title>{id}</Card.Title>}
			</Card.Header>
			<Card.Body className="p-0 m-0">
				{user && <div className="card-body">
						<div className="d-flex flex-column align-items-center text-center">
							<img src={'/assets/images/avatars/user-purple-2.jpg'} alt="Admin"
								 className="rounded-circle p-1 bg-primary" width="110"/>
							<div className="mt-3">
								<h4>{user.firstName} {user.lastName}</h4>
								<p className="text-secondary mb-1">{user.email}</p>
								<p className="text-secondary mb-1">{user.phoneNumber}</p>
								{showReportButtons && <div>
									{orderStatus==='ACTIVE' && token ? <button className="btn btn-outline-primary mb-2" onClick={previewReport}><i
										className="bx bx-chart"/> View Report
									</button> : <button className="btn btn-outline-primary mb-2 disabled" title="Report not ready" type="button">
										<i className="bx bx-chart"/> View Report
									</button>}
									&nbsp;&nbsp;
									{orderStatus==='ACTIVE' && token ? <span>
									{download ?<button className="btn btn-outline-primary mb-2 disabled" type="button" disabled={true}>
										<Spinner animation="grow" size="sm" variant="secondary" /> Download Report
									</button> : <button className="btn btn-outline-primary mb-2" onClick={()=>setDownload(true)}><i
										className="bx bxs-file-pdf"/> Download Report
									</button>}
								</span> : <button className="btn btn-outline-primary mb-2 disabled" title="Report not ready" type="button">
										<i className="bx bxs-file-pdf"/> Download Report
									</button>}
									{orderStatus==='ACTIVE' && token && download && <div className="position-fixed" style={{width:pdfStyles.width, height:'100%', left:'-3000px'}}>
										<ReportFrame frameRef={pdfRef} token={token} tenantId={id} leaseId={false} onReadyCallback={downloadPdf}/>
									</div>}
								</div>}
							</div>
						</div>
						<hr className="my-4"/>
						<ul className="list-group list-group-flush">
							{user.address && <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
								<h6 className="mb-0">Address</h6>
								<span className="text-secondary">{user.address.addressLine1}{user.address.addressLine2 ? ', ' : ''}{user.address.addressLine2} </span>
							</li>}
							{user.address && user.address.city && <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
								<h6 className="mb-0">City</h6>
								<span className="text-secondary">{user.address.city}</span>
							</li>}
							{user.address && user.address.country && <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
								<h6 className="mb-0">Country</h6>
								<span className="text-secondary">{user.address ? user.address.country : ''}</span>
							</li>}
							<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
								<h6 className="mb-0">Leases</h6>
								<span className="text-secondary">{summary ? summary.leases.length : 0}</span>
							</li>
							
							
							<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
								&nbsp;
							</li>
						</ul>
				</div>}
			</Card.Body>
			<ReportModal />
		</Card>
	)
}

export default TenantSummary