import React from "react";
import {Form, Formik} from "formik";
import {schema} from "./userFields";
import {Button, Card, Form as BSForm, Modal, Spinner} from "react-bootstrap";
import {setError, setInfo} from "../../../features/notifications/NotificationSlice";
import {get_axios_error} from "../../../helpers/general";
import {useDispatch} from "react-redux";
import {setupUser} from "../../../features/auth/ProfileSlice";

function EditProfile(props){
	const dispatch = useDispatch()
	const user = props.user
	
	const initialValues = user ? {
		firstName: user.firstName || '',
		lastName: user.lastName || '',
		email: user.email || '',
		phoneNumber: user.phoneNumber || '',
		roles: user.roles || [],
		address: {
			addressLine1: user.address.addressLine1 || '',
			addressLine2: user.address.addressLine2 || '',
			city: user.address.city || '',
			country: user.address.country || '',
			postCode: user.address.postCode || ''
		}
	} : {}
	
	const handleSubmit = (form, FormikBag) => {
		const data = Object.assign(user, form);
		window.axios.put( 'profile/'+user.id, data )
			.then( response => {
				props.setEdit('view')
				dispatch(setInfo(response.data.message))
				const updatedUser = response.data.data ? response.data.data : false
				if(updatedUser.id) dispatch(setupUser(updatedUser))
			})
			.catch( ( error ) => {
				const e = get_axios_error(error)
				dispatch(setError(e.message))
				FormikBag.setSubmitting(false)
			})
	}
	
	return (
		<div>
			<Formik onSubmit={(values, FormikBag)=>handleSubmit(values, FormikBag)}
					validationSchema={schema} initialValues={initialValues}
			>
				{({errors, values, handleChange, isSubmitting}) => (
					<Form noValidate className="card">
						<Card.Header>
							<Modal.Title>{user.firstName} {user.lastName}</Modal.Title>
						</Card.Header>
						<Card.Body className="m-0">
							<fieldset className={'row'}><legend>User Details</legend>
								<BSForm.Group className="col-6 mb-3">
									<label htmlFor="firstName">First Name</label>
									<BSForm.Control id="firstName" name="firstName" type="text"
													onChange={handleChange} value={values.firstName}
													isInvalid={!!errors.firstName}/>
									<BSForm.Control.Feedback type="invalid">{errors.firstName}</BSForm.Control.Feedback>
								</BSForm.Group>
								<BSForm.Group className="col-6 mb-3">
									<label htmlFor="firstName">Last Name</label>
									<BSForm.Control id="lastName" name="lastName" type="text"
													onChange={handleChange} value={values.lastName} isInvalid={!!errors.lastName}/>
									<BSForm.Control.Feedback type="invalid">{errors.lastName}</BSForm.Control.Feedback>
								</BSForm.Group>
								<BSForm.Group className="col-6 mb-3">
									<label htmlFor="emailAddress">Email Address</label>
									<BSForm.Control type="email" name="email" id="emailAddress" autoComplete="email"
													onChange={handleChange} value={values.email} isInvalid={!!errors.email}/>
									<BSForm.Control.Feedback type="invalid">{errors.email}</BSForm.Control.Feedback>
								</BSForm.Group>
								<BSForm.Group className="col-6 mb-3">
									<label htmlFor="phoneNumber">Phone Number</label>
									<BSForm.Control id="phoneNumber" name="phoneNumber" type="text"
													onChange={handleChange} value={values.phoneNumber} isInvalid={!!errors.phoneNumber}/>
									<BSForm.Control.Feedback type="invalid">{errors.phoneNumber}</BSForm.Control.Feedback>
								</BSForm.Group>
							</fieldset>
							
							<div className="clearfix py-2"><hr /></div>
							
							<fieldset className={'row'}><legend>Address</legend>
								<BSForm.Group className="col-6 mb-3">
									<label htmlFor="addressLine1">Address Line 1</label>
									<BSForm.Control id="addressLine1" name="address.addressLine1" type="text"
													onChange={handleChange} value={values.address.addressLine1}/>
								</BSForm.Group>
								<BSForm.Group className="col-6 mb-3">
									<label htmlFor="addressLine2">Address Line 2</label>
									<BSForm.Control id="addressLine2" name="address.addressLine2" type="text"
													onChange={handleChange} value={values.address.addressLine2}/>
								</BSForm.Group>
								<BSForm.Group className="col-6 mb-3">
									<label htmlFor="city">City</label>
									<BSForm.Control id="city" name="address.city" type="text"
													onChange={handleChange} value={values.address.city}/>
								</BSForm.Group>
								<BSForm.Group className="col-6 mb-3">
									<label htmlFor="country">Country</label>
									<BSForm.Control id="country" name="address.country" type="text"
													onChange={handleChange} value={values.address.country}/>
								</BSForm.Group>
								<BSForm.Group className="col-6 mb-3">
									<label htmlFor="postCode">Postcode</label>
									<BSForm.Control id="postCode" name="address.postCode" type="text"
													onChange={handleChange} value={values.address.postCode}/>
								</BSForm.Group>
							</fieldset>
						</Card.Body>
						<Card.Footer className="text-end">
							<Button variant="outline-secondary" className="me-3" onClick={()=>props.setEdit('view')}>Back</Button>
							{isSubmitting ? <Button variant="primary" disabled>
								<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> Save Changes
							</Button> : <Button type="submit" variant="primary"><i className="bx bxs-save"/>Save Changes</Button> }
						</Card.Footer>
					</Form>
				)}
			</Formik>
		</div>)
}

export default EditProfile