import {Modal} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {setError, setInfo, setWarning} from "../../../../features/notifications/NotificationSlice";
import {get_axios_error} from "../../../../helpers/general";
import LeaseForm from "./LeaseForm";

function EditLease(props){
	const lease = props.lease
	const dispatch = useDispatch()
	const [alert, setAlert] = useState('')
	const [options, setOptions] = useState(props.leaseOptions?props.leaseOptions:[])
	const [optionsFetched, setOptionsFetched] = useState(false)
	
	const handleSubmit = (form, FormikBag) => {
		setAlert('')
		const data = Object.assign(lease, form);
		window.axios.put('lease/' + lease.id, data)
			.then(response => {
				props.onHide()
				if (response.data.data) props.updateLease(response.data.data)
				dispatch(setInfo(response.data.message))
			})
			.catch((error) => {
				const e = get_axios_error(error)
				dispatch(setError(e.message))
				FormikBag.setSubmitting(false)
				setAlert(e.message)
			})
		
	}
	
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
	
	useEffect(()=>{
		let isSubscribed = true;
		if(isSubscribed && options.length===0 && !optionsFetched){
			getLeaseOptions()
		}
		return function cleanup() {
			isSubscribed = false
		}
	},[getLeaseOptions, options.length, optionsFetched])
	
	const initialValues = {
		tenantId: lease.tenantId || '',
		propertyId: lease.propertyId || '',
		startDate: lease.startDate || '',
		endDate: lease.endDate || '',
		billFrom: lease.billFrom || '',
		currency: lease.currency || '',
		status: lease.status || '',
		deposit: lease.deposit || '',
		amount: lease.amount || '',
		// paymentsDue: lease.paymentsDue || '',
		dueIn: lease.dueIn || '',
		gracePeriod: lease.gracePeriod || 0,
		leaseAgreement: lease.leaseAgreement || '',
		// comments: [''],
		paymentSchedule: {
			cycle: lease.paymentSchedule.cycle || 'MONTH',
			repeatEvery: lease.paymentSchedule.repeatEvery || 1,
			dayOfWeek: lease.paymentSchedule.dayOfWeek || 1,
			dayOfMonth: lease.paymentSchedule.dayOfMonth || 0,
			monthOfYear: lease.paymentSchedule.monthOfYear || 0
		}
	}
	
	return (
		<Modal size="lg" show={props.show} onHide={props.onHide}>
			
			<LeaseForm
				initialValues={initialValues}
				handleSubmit={handleSubmit}
				leaseOptions={options}
				alert={alert}
				setAlert={setAlert}
				hide={props.onHide}
				title={'Edit Lease'}
				buttonText={'Save Changes'}
				lease={lease}
			/>
		</Modal>
	)
}

export default EditLease