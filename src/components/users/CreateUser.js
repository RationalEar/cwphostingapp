import {Button, Modal, Form as BSForm, Alert, Spinner} from "react-bootstrap";
import React, {useState} from "react";
import {Formik, Form, FieldArray} from "formik";
import {get_axios_error} from "../../helpers/general";
import {useDispatch} from "react-redux";
import { setInfo} from "../../features/notifications/NotificationSlice";
import CheckboxPill from "../input/CheckboxPill";
import {schema} from "./userFields";

function CreateUser(props) {
	const [alert, showAlert] = useState('')
	const dispatch = useDispatch()
	
	const handleSubmit = (form, FormikBag) => {
		console.log(form)
		showAlert('')
		window.axios.post('users', form)
			.then(response => {
				props.onRefresh()
				dispatch(setInfo(response.data.message))
				props.onHide()
			})
			.catch((error) => {
				const e = get_axios_error(error)
				showAlert(e.message)
				FormikBag.setSubmitting(false)
			})
	}
	
	const initialValues = {
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
		roles: [],
		address: {
			addressLine1: '',
			addressLine2: '',
			city: '',
			country: '',
			postCode: ''
		}
	}
	
	return (
		<Modal size="lg" show={props.show} onHide={props.onHide}>
			<Formik initialValues={initialValues} onSubmit={(values, FormikBag) => handleSubmit(values, FormikBag)} validationSchema={schema}>
				{({errors, values, handleChange, isSubmitting}) => (
					<Form noValidate className="g-3">
						<Modal.Header closeButton>
							<Modal.Title>Create New User Account</Modal.Title>
						</Modal.Header>
						<Modal.Body className="m-0">
									{ alert && <Alert variant={'warning'} onClose={() => showAlert('')} dismissible>{alert}</Alert> }
									<fieldset className={'row'}>
										<legend>User Details</legend>
										<BSForm.Group className="col-6 mb-3">
											<label htmlFor="firstName">First Name</label>
											<BSForm.Control id="firstName" name="firstName" type="text"
															value={values.firstName} onChange={handleChange}
															isInvalid={!!errors.firstName}/>
											<BSForm.Control.Feedback
												type="invalid">{errors.firstName}</BSForm.Control.Feedback>
										</BSForm.Group>
										<BSForm.Group className="col-6 mb-3">
											<label htmlFor="firstName">Last Name</label>
											<BSForm.Control id="lastName" name="lastName" type="text"
															value={values.lastName} onChange={handleChange}
															isInvalid={!!errors.lastName}/>
											<BSForm.Control.Feedback
												type="invalid">{errors.lastName}</BSForm.Control.Feedback>
										</BSForm.Group>
										<BSForm.Group className="col-6 mb-3">
											<label htmlFor="emailAddress">Email Address</label>
											<BSForm.Control type="email" name="email" id="emailAddress"
															autoComplete="email"
															onChange={handleChange} value={values.email}
															isInvalid={!!errors.email}/>
											<BSForm.Control.Feedback
												type="invalid">{errors.email}</BSForm.Control.Feedback>
										</BSForm.Group>
										<BSForm.Group className="col-6 mb-3">
											<label htmlFor="phoneNumber">Phone Number</label>
											<BSForm.Control id="phoneNumber" name="phoneNumber" type="text"
															onChange={handleChange} value={values.phoneNumber}
															isInvalid={!!errors.phoneNumber}/>
											<BSForm.Control.Feedback
												type="invalid">{errors.phoneNumber}</BSForm.Control.Feedback>
										</BSForm.Group>
									</fieldset>
									
									<div className="clearfix py-2">
										<hr/>
									</div>
									
									<fieldset className={'row'}>
										<legend>User Roles</legend>
										<FieldArray name={'roles'} render={arrayHelpers => (
												<BSForm.Group className="mb-0">
													{props.roles.length > 0 && props.roles.map((role, index) => (
														<CheckboxPill variant={'info'} key={role.id}
																	  name={"roles[" + index + "]"} className="me-2 mb-2"
																	  value={role} defaultChecked={false}
																	  onRemove={() => {
																		  const i = values.roles.findIndex( r => r.id === role.id )
																		  if(i >=0 ) arrayHelpers.remove(i)
																	  }}
																	  onAdd={() => arrayHelpers.push(role)}>
															{role.alias}
														</CheckboxPill>
													))}
												</BSForm.Group>
											)}/>
									</fieldset>
									
									
									<div className="clearfix py-2">
										<hr/>
									</div>
									
									<fieldset className={'row'}>
										<legend>Address</legend>
										<BSForm.Group className="col-6 mb-3">
											<label htmlFor="addressLine1">Address Line 1</label>
											<BSForm.Control id="addressLine1" name="address.addressLine1" type="text"
															onChange={handleChange}
															value={values.address.addressLine1}/>
										</BSForm.Group>
										<BSForm.Group className="col-6 mb-3">
											<label htmlFor="addressLine2">Address Line 2</label>
											<BSForm.Control id="addressLine2" name="address.addressLine2" type="text"
															onChange={handleChange}
															value={values.address.addressLine2}/>
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
						</Modal.Body>
						<Modal.Footer style={{borderTop: 'none'}}>
							{isSubmitting ? <Button variant="primary" disabled>
								<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> Create Account
							</Button> : <Button type="submit" variant="primary"><i className="bx bxs-save"/>Create Account</Button> }
							<Button variant="secondary" onClick={props.onHide}>Close</Button>
						</Modal.Footer>
					</Form>
				)}
			</Formik>
		</Modal>
	)
}

export default CreateUser