import {Modal} from "react-bootstrap";
import React, {useState} from "react";
import {get_axios_error} from "../../../../helpers/general";
import {useDispatch} from "react-redux";
import { setInfo} from "../../../../features/notifications/NotificationSlice";
import './Lease.css'
import LeaseForm from "./LeaseForm";

function CreateLease(props) {
	
	const dispatch = useDispatch()
	const [alert, setAlert] = useState('')
	
	const handleSubmit = (form, FormikBag) => {
		console.log(form)
		setAlert('')
		window.axios.post('lease', form)
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
	
	const initialValues = {
		tenantId: '',
		propertyId: '',
		startDate: '',
		endDate: '',
		billFrom: '',
		currency: '',
		status: '',
		deposit: '',
		amount: '',
		// paymentsDue: '',
		dueIn: '',
		gracePeriod: 0,
		leaseAgreement: '',
		// comments: [''],
		paymentSchedule: {
			cycle: 'MONTH',
			repeatEvery: 1,
			dayOfWeek: 1,
			dayOfMonth: 0,
			monthOfYear: 0
		}
	}
	
	return (
		<Modal size="lg" show={props.show} onHide={props.onHide}>
			<LeaseForm
				initialValues={initialValues}
				handleSubmit={handleSubmit}
				leaseOptions={props.leaseOptions}
				alert={alert}
				setAlert={setAlert}
				hide={props.onHide}
				title={'Create New Lease'}
				buttonText={'Create Lease'}
			/>
		</Modal>
	)
}

export default CreateLease