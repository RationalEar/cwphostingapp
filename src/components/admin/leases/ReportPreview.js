import {Button, Modal} from "react-bootstrap";
import React, {useRef} from "react";
import {pdfStyles} from "./pdfStyles"
import ReportFrame from "./ReportFrame";
import {generatePdf} from "../../../helpers/general";

function ReportPreview({leaseId, tenantId, token, show, onHide}) {
	const frameRef = useRef(null)
	const fileName = leaseId ? leaseId : tenantId
	return (
		<Modal fullscreen={true} show={show} onHide={onHide}>
			<Modal.Header closeButton className={'d-print-none'}>
				<Modal.Title>Lease Report Preview</Modal.Title>
				<Button className={'ms-5'} type={'button'} variant={'outline-secondary'} onClick={()=>generatePdf(frameRef, fileName)}>
					<i className="bx bxs-file-pdf" /> Download as PDF
				</Button>
			</Modal.Header>
			<Modal.Body className={'p-0'}>
				<div className="mx-auto" style={{width:pdfStyles.width, height:'100%'}}>
					<ReportFrame frameRef={frameRef} token={token} tenantId={tenantId} leaseId={leaseId} />
				</div>
			</Modal.Body>
		</Modal>
	)
}

export default ReportPreview