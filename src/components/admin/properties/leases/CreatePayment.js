import {Modal} from "react-bootstrap";
import React, {useState} from "react";
import {get_axios_error, leftPad} from "../../../../helpers/general";
import {useDispatch, useSelector} from "react-redux";
import { setInfo} from "../../../../features/notifications/NotificationSlice";
import './Lease.css'
import PaymentForm from "./PaymentForm";

function CreatePayment(props) {
	
	const profile = useSelector((state) => state.profile)
	const dispatch = useDispatch()
	const [alert, setAlert] = useState('')
	
	const handleSubmit = (form, FormikBag) => {
		console.log(form)
		setAlert('')
		form.invoiceId = props.invoice.id
		form.leaseId = props.invoice.leaseId
		form.tenantId = props.invoice.tenantId
		form.ownerId = props.lease.ownerId
		form.postedBy = {role: profile.role.name}
		
		window.axios.post('/rent-invoice/'+props.invoice.id, form)
			.then(response => {
				props.onHide()
				dispatch(setInfo(response.data.message))
				props.onRefresh()
			})
			.catch((error) => {
				const e = get_axios_error(error)
				setAlert(e.message)
				FormikBag.setSubmitting(false)
			})
	}
	
	const defaultDate = () => {
		const date = new Date()
		let m = date.getMonth()+1;
		if(m<10) m = '0'+m;
		let d = date.getDate();
		if(d<10) d = '0'+d
		const h = leftPad(date.getHours(), 2)
		const i = leftPad(date.getMinutes(), 2)
		return date.getFullYear()+'-'+m+'-'+d+'T'+h+':'+i
	}
	
	const initialValues = {
		paymentDate: defaultDate(),
		amount: props.invoice.amountDue,
		currency: props.invoice.currency,
		paymentMethod: 'BANK_TRANSFER',
		confirmed: true,
		comment: '',
		exchangeRate: 1
	}
	
	return (
		<Modal size="lg" show={props.show} onHide={props.onHide}>
			<PaymentForm
				initialValues={initialValues}
				handleSubmit={handleSubmit}
				currencies={props.currencies}
				paymentMethods={props.paymentMethods}
				alert={alert}
				setAlert={setAlert}
				hide={props.onHide}
				title={'Record Payment'}
				buttonText={'Save Payment'}
				invoice={props.invoice}
			/>
		</Modal>
	)
}

export default CreatePayment