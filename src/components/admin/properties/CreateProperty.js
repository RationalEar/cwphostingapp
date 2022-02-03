import {Button, Modal, Form as BSForm, Alert, Spinner} from "react-bootstrap";
import React, {useState} from "react";
import {Formik, Form} from "formik";
import {get_axios_error} from "../../../helpers/general";
import {useDispatch, useSelector} from "react-redux";
import { setInfo} from "../../../features/notifications/NotificationSlice";
import {schema} from "./propertyFields";
import UserSelect from "./UserSelect";

function CreateProperty(props) {
	const [alert, showAlert] = useState('')
	const dispatch = useDispatch()
	const profile = useSelector((state) => state.profile)
	
	const handleSubmit = (form, FormikBag) => {
		console.log(form)
		showAlert('')
		window.axios.post('properties', form)
			.then(response => {
				dispatch(setInfo(response.data.message))
				props.onHide()
				props.onRefresh()
			})
			.catch((error) => {
				const e = get_axios_error(error)
				showAlert(e.message)
				FormikBag.setSubmitting(false)
			})
	}
	
	const initialValues = {
		name: '',
		description: '',
		status: '',
		ownerId: profile.role.name==='MANAGER' ? profile.id : '',
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
				{({errors, values, handleChange, isSubmitting,
					  setFieldValue, setFieldTouched, touched}) => (
					<Form noValidate className="g-3">
						<Modal.Header closeButton>
							<Modal.Title>Create New Property</Modal.Title>
						</Modal.Header>
						<Modal.Body className="m-0">
									{ alert && <Alert variant={'warning'} onClose={() => showAlert('')} dismissible>{alert}</Alert> }
									<fieldset className={'row'}>
										<BSForm.Group className="col-6 mb-3">
											<label htmlFor="name">Name</label>
											<BSForm.Control id="name" name="name" type="text"
															value={values.name} onChange={handleChange}
															isInvalid={!!errors.name}/>
											<BSForm.Control.Feedback
												type="invalid">{errors.name}</BSForm.Control.Feedback>
										</BSForm.Group>
										<BSForm.Group className="col-6 mb-3">
											<label htmlFor="status">Status</label>
											<BSForm.Select  id="status" name="status" type="select" options={props.statuses}
															value={values.status} onChange={handleChange}
															isInvalid={!!errors.status}>
												<option>Select status</option>
												{props.statuses.map( option => {
													return <option key={option} value={option}>{option}</option>
												} )}
											</BSForm.Select>
											<BSForm.Control.Feedback
												type="invalid">{errors.status}</BSForm.Control.Feedback>
										</BSForm.Group>
										<BSForm.Group className="col-12 mb-3">
											<label htmlFor="name">Description</label>
											<BSForm.Control as="textarea" name="description" value={values.description} onChange={handleChange} />
										</BSForm.Group>
										{profile.role.name==='MANAGER' ? <BSForm.Group className={'col-12 mb-3'}>
											<label htmlFor={'ownerId'}>Owner</label>
											<div className={'form-control text-muted'}>{profile.firstName} {profile.lastName} ({profile.email})</div>
										</BSForm.Group> : <BSForm.Group className={'col-12 mb-3'}>
											<label htmlFor={'ownerId'}>Owner</label>
											<UserSelect
												value={values.ownerId}
												name={'ownerId'}
												onChange={setFieldValue}
												onBlur={setFieldTouched}
												touched={touched.ownerId}
												error={errors.ownerId}
											/>
										</BSForm.Group>}
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
								<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> Create Property
							</Button> : <Button type="submit" variant="primary"><i className="bx bxs-save"/>Create Property</Button> }
							<Button variant="secondary" onClick={props.onHide}>Close</Button>
						</Modal.Footer>
					</Form>
				)}
			</Formik>
		</Modal>
	)
}

export default CreateProperty