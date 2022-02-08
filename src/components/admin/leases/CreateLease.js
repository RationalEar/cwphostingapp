import {Modal} from "react-bootstrap";
import React, {useState} from "react";
import {get_axios_error} from "../../../helpers/general";
import {useDispatch} from "react-redux";
import { setInfo} from "../../../features/notifications/NotificationSlice";
import './Lease.css'
import LeaseForm from "./LeaseForm";
import {initialValues} from "./leaseFields";

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