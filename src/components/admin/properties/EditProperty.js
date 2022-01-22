import {Button, Form as BSForm, Modal, Spinner} from "react-bootstrap";
import React from "react";
import {Formik, Form} from "formik";
import {useDispatch} from "react-redux";
import {setError, setInfo} from "../../../features/notifications/NotificationSlice";
import {get_axios_error} from "../../../helpers/general";
import {schema} from "./propertyFields";
import UserSelect from "./UserSelect";

function EditProperty(props){
	const property = props.property
	const dispatch = useDispatch()
	
	const handleSubmit = (form, FormikBag) => {
		const data = Object.assign(property, form);
		window.axios.put('properties/' + property.id, data)
			.then(response => {
				if (response.data.data) props.updateProperty(response.data.data)
				props.onHide()
				dispatch(setInfo(response.data.message))
			})
			.catch((error) => {
				const e = get_axios_error(error)
				dispatch(setError(e.message))
				FormikBag.setSubmitting(false)
			})
		
	}
	
	const initialValues = {
		name: property.name || '',
		description: property.description || '',
		status: property.status || '',
		ownerId: property.ownerId || '',
		address: {
			addressLine1: property.address.addressLine1 || '',
			addressLine2: property.address.addressLine2 || '',
			city: property.address.city || '',
			country: property.address.country || '',
			postCode: property.address.postCode || ''
		}
	}
	
	return (
		<Modal size="lg" show={props.show} onHide={props.onHide}>
			<Formik onSubmit={(values, FormikBag)=>handleSubmit(values, FormikBag)}
					validationSchema={schema} initialValues={initialValues}
			>
				{({errors, values, handleChange,
					  isSubmitting, setFieldValue, touched, setFieldTouched}) => (
					<Form noValidate className="g-3">
						<Modal.Header closeButton>
							<Modal.Title>{property.name}</Modal.Title>
						</Modal.Header>
						<Modal.Body className="m-0">
									<fieldset className={'row'}><legend>Property Details</legend>
										<BSForm.Group className="col-6 mb-3">
											<label htmlFor="name">Property Name</label>
											<BSForm.Control id="name" name="name" type="text"
														  onChange={handleChange} value={values.name}
														  isInvalid={!!errors.name}/>
											<BSForm.Control.Feedback type="invalid">{errors.name}</BSForm.Control.Feedback>
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
										
										<BSForm.Group className={'col-12 mb-3'}>
											<label htmlFor={'ownerId'}>Owner</label>
											<UserSelect
												value={values.ownerId}
												name={'ownerId'}
												defaultUser={property.owner}
												onChange={setFieldValue}
												onBlur={setFieldTouched}
												touched={touched.ownerId}
												error={errors.ownerId}
											/>
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
						</Modal.Body>
						<Modal.Footer style={{borderTop:'none'}}>
							{isSubmitting ? <Button variant="primary" disabled>
								<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> Save Changes
							</Button> : <Button type="submit" variant="primary"><i className="bx bxs-save"/>Save Changes</Button> }
							<Button variant="secondary" onClick={props.onHide}>Close</Button>
						</Modal.Footer>
					</Form>
				)}
			</Formik>
		</Modal>
	)
}

export default EditProperty