import React, {useEffect, useState} from "react";
import {Form, Formik} from "formik";
import {Alert, Button, Card, Form as BSForm, InputGroup, Spinner} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import * as yup from "yup";
import './OrderForm.css'
import {setInfo} from "../../../features/notifications/NotificationSlice";
import {get_axios_error} from "../../../helpers/general";
import OrderPayment from "./OrderPayment";

function OrderForm({id, tenant}){
	const dispatch = useDispatch()
	const profile = useSelector((state) => state.profile)
	const [alert, setAlert] = useState('')
	const [ready, setReady] = useState(false)
	const [initialValues, setInitialValues] = useState()
	
	const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
	const schema = yup.object().shape({
		user: yup.object().shape({
			firstName: yup.string().required('First Name is required').min(2, 'A name should have at least 2 characters'),
			lastName: yup.string().required('Last Name is required').min(2, 'A name should have at least 2 characters'),
			email: yup.string().email().required('Email Address is required'),
			phoneNumber: yup.string().min(4, 'Phone number must have at least 4 digits').matches( phoneRegExp, 'Phone number is not valid' ).required('Phone Number is required'),
			id: yup.string()
		}),
		tenant: yup.object().shape({
			firstName: yup.string().min(2, 'A name should have at least 2 characters'),
			lastName: yup.string().min(2, 'A name should have at least 2 characters'),
			email: yup.string().email(),
			phoneNumber: yup.string().min(4, 'Phone number must have at least 4 digits').matches( phoneRegExp, 'Phone number is not valid' ),
			id: yup.string()
		}),
		tenantId: yup.string().required(),
		currency: yup.string().required(),
		paymentMethod: yup.string().required(),
		mobileMoneyNumber: yup.string().min(4, 'Phone number must have at least 4 digits').matches( phoneRegExp, 'Phone number is not valid' )
	})
	
	useEffect(()=>{
		if(!ready){
			console.log(profile)
			setReady(true)
			const v = {
				user: {
					firstName: profile.firstName || '',
					lastName: profile.lastName || '',
					phoneNumber: profile.phoneNumber || '',
					email: profile.email || '',
					id: profile.id || ''
				},
				tenant: {
					firstName: tenant.firstName || '',
					lastName: tenant.lastName || '',
					phoneNumber: tenant.phoneNumber || '',
					email: tenant.email || '',
					id: tenant.id || ''
				},
				tenantId: id,
				currency: 'ZWD',
				paymentMethod: '',
				mobileMoneyNumber: profile.phoneNumber || '',
				returnUrl: window.location.origin+'/orders/'
			}
			setInitialValues(v)
		}
	},[id, profile, profile.email, profile.firstName, profile.id, profile.lastName, profile.phoneNumber, ready, tenant.email, tenant.firstName, tenant.id, tenant.lastName, tenant.phoneNumber])
	
	const handleSubmit = (form, FormikBag) => {
		console.log(form)
		setAlert('')
		window.axios.post('orders', form)
			.then(response => {
				const order = response.data
				if(order.message) dispatch(setInfo(response.data.message))
				
				if(order.isMobile){
					setAlert(order.instructions)
				}
				else if (order.redirectUrl){
					window.location.href = order.redirectUrl
				}
			})
			.catch((error) => {
				const e = get_axios_error(error)
				setAlert(e.message)
			})
			.finally(()=>{
				FormikBag.setSubmitting(false)
			})
	}
	
	if(ready) return(
		<Formik initialValues={initialValues} onSubmit={(values, FormikBag) => handleSubmit(values, FormikBag)} validationSchema={schema}>
			{({errors, values, handleChange, isSubmitting}) => (
				<Form noValidate className="g-3">
					{ alert && <Alert variant={'warning'} onClose={() => setAlert('')} dismissible>{alert}</Alert> }
					<fieldset className={'row'}>
						<Card.Title className="d-flex align-items-center">
							<h5 className="mb-0 text-danger">Your Info</h5>
						</Card.Title>
						<hr />
						<BSForm.Group className="col-6 mb-3">
							<label htmlFor="user.firstName" className="form-label">First Name</label>
							<InputGroup hasValidation>
								<span className="input-group-text bg-transparent"><i className="bx bxs-user"/></span>
								<BSForm.Control type={'text'} id="user.firstName" placeholder="First Name"
												value={values.user.firstName} onChange={handleChange} isInvalid={errors.user && !!errors.user.firstName}/>
								<BSForm.Control.Feedback type="invalid">{errors.user && errors.user.firstName}</BSForm.Control.Feedback>
							</InputGroup>
						</BSForm.Group>
						<BSForm.Group className="col-6 mb-3">
							<label htmlFor="user.lastName" className="form-label">Last Name</label>
							<InputGroup hasValidation>
								<span className="input-group-text bg-transparent"><i className="bx bxs-user"/></span>
								<BSForm.Control type={'text'} id="user.lastName" placeholder="Last Name"
												value={values.user.lastName} onChange={handleChange} isInvalid={errors.user && !!errors.user.lastName}/>
								<BSForm.Control.Feedback type="invalid">{errors.user && errors.user.lastName}</BSForm.Control.Feedback>
							</InputGroup>
						</BSForm.Group>
						
						<BSForm.Group className="col-6 mb-3" id={'startDate'}>
							<label htmlFor="user.phoneNumber" className="form-label">Phone Number</label>
							<InputGroup hasValidation>
								<span className="input-group-text bg-transparent"><i className="bx bx-phone"/></span>
								<BSForm.Control type={'phone'} id="user.phoneNumber" placeholder="Phone Number"
												value={values.user.phoneNumber} onChange={handleChange} isInvalid={errors.user && !!errors.user.phoneNumber}/>
								<BSForm.Control.Feedback type="invalid">{errors.user && errors.user.phoneNumber}</BSForm.Control.Feedback>
							</InputGroup>
						</BSForm.Group>
						<BSForm.Group className="col-6 mb-3">
							<label htmlFor="user.email" className="form-label">Email Address</label>
							<InputGroup hasValidation>
								<span className="input-group-text bg-transparent"><i className="bx bx-envelope"/></span>
								<BSForm.Control type={'email'} id="user.email" placeholder="Email Address"
												value={values.user.email} onChange={handleChange} isInvalid={errors.user && !!errors.user.email}/>
								<BSForm.Control.Feedback type="invalid">{errors.user && errors.user.email}</BSForm.Control.Feedback>
							</InputGroup>
						</BSForm.Group>
					
					</fieldset>
					
					<OrderPayment errors={errors} values={values} handleChange={handleChange}/>
					
					<fieldset>
						{isSubmitting ? <Button variant="danger" className="px-5 float-end" disabled>
							<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> Buy Now
						</Button> : <Button variant={'danger'} type="submit" className="px-5 float-end"><i className="bx bx-check" /> Buy Now</Button> }
					</fieldset>
				</Form>
			)}
		</Formik>
	)
	else return null
}

export default OrderForm