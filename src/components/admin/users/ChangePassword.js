import React from "react";
import {Form, Formik} from "formik";
import {changePasswordSchema} from "./userFields";
import {Button, Card, Col, Form as BSForm, Modal, Row, Spinner} from "react-bootstrap";
import {setError, setInfo} from "../../../features/notifications/NotificationSlice";
import {get_axios_error} from "../../../helpers/general";
import {useDispatch} from "react-redux";

function ChangePassword(props){
	const dispatch = useDispatch()
	const initialValues = {
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	}
	
	const handleSubmit = (form, FormikBag) => {
		window.axios.post( 'profile/password', form )
			.then( response => {
				props.setEdit('view')
				dispatch(setInfo(response.data.message))
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
					validationSchema={changePasswordSchema} initialValues={initialValues}
			>
				{({errors, values, handleChange, isSubmitting}) => (
					<Form noValidate className="card">
						<Card.Header>
							<Modal.Title>Change Password</Modal.Title>
						</Card.Header>
						<Card.Body className="m-0">
							<Row>
								<Col md={{ span: 6, offset: 2 }}>
									<fieldset>
										<BSForm.Group className="mb-3">
											<label htmlFor="currentPassword">Current Password</label>
											<BSForm.Control id="currentPassword" name="currentPassword" type="password"
															onChange={handleChange} value={values.currentPassword}
															isInvalid={!!errors.currentPassword}/>
											<BSForm.Control.Feedback type="invalid">{errors.currentPassword}</BSForm.Control.Feedback>
										</BSForm.Group>
										<BSForm.Group className="mb-3">
											<label htmlFor="newPassword">New Password</label>
											<BSForm.Control id="newPassword" name="newPassword" type="password"
															onChange={handleChange} value={values.newPassword} isInvalid={!!errors.newPassword}/>
											<BSForm.Control.Feedback type="invalid">{errors.newPassword}</BSForm.Control.Feedback>
										</BSForm.Group>
										<BSForm.Group className="mb-3">
											<label htmlFor="confirmPassword">Confirm Password</label>
											<BSForm.Control type="password" name="confirmPassword" id="confirmPassword"
															onChange={handleChange} value={values.confirmPassword} isInvalid={!!errors.confirmPassword}/>
											<BSForm.Control.Feedback type="invalid">{errors.confirmPassword}</BSForm.Control.Feedback>
										</BSForm.Group>
									</fieldset>
								</Col>
							</Row>
							
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

export default ChangePassword