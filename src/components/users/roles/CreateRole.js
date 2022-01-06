import {Button, Modal, Form as BSForm, Alert, Spinner} from "react-bootstrap";
import React, {useState} from "react";
import {Formik, Form} from "formik";
import {get_axios_error} from "../../../helpers/general";
import {useDispatch} from "react-redux";
import { setInfo} from "../../../features/notifications/NotificationSlice";
import {roleSchema} from "../userFields";

function CreateRole(props) {
	const [alert, showAlert] = useState('')
	const dispatch = useDispatch()
	
	const handleSubmit = (form, FormikBag) => {
		console.log(form)
		showAlert('')
		window.axios.post('roles', form)
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
		name: '',
		alias: ''
	}
	
	return (
		<Modal show={props.show} onHide={props.onHide}>
			<Formik initialValues={initialValues} onSubmit={(values, FormikBag) => handleSubmit(values, FormikBag)} validationSchema={roleSchema}>
				{({errors, values, handleChange, isSubmitting}) => (
					<Form noValidate className="g-3">
						<Modal.Header closeButton>
							<Modal.Title>Create New User Role</Modal.Title>
						</Modal.Header>
						<Modal.Body className="m-0">
							{ alert && <Alert variant={'warning'} onClose={() => showAlert('')} dismissible>{alert}</Alert> }
							<fieldset>
								<BSForm.Group className="col-12 mb-3">
									<label htmlFor="name">Role Name</label>
									<BSForm.Control id="name" name="name" type="text"
													value={values.name} onChange={handleChange}
													isInvalid={!!errors.name}/>
									<BSForm.Control.Feedback
										type="invalid">{errors.name}</BSForm.Control.Feedback>
								</BSForm.Group>
								<BSForm.Group className="col-12 mb-3">
									<label htmlFor="name">Role Alias</label>
									<BSForm.Control id="alias" name="alias" type="text"
													value={values.alias} onChange={handleChange}
													isInvalid={!!errors.alias}/>
									<BSForm.Control.Feedback
										type="invalid">{errors.alias}</BSForm.Control.Feedback>
								</BSForm.Group>
							</fieldset>
						</Modal.Body>
						<Modal.Footer style={{borderTop: 'none'}}>
							{isSubmitting ? <Button variant="primary" disabled>
								<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> Create Role
							</Button> : <Button type="submit" variant="primary"><i className="bx bxs-save"/>Create Role</Button> }
							<Button variant="secondary" onClick={props.onHide}>Close</Button>
						</Modal.Footer>
					</Form>
				)}
			</Formik>
		</Modal>
	)
}

export default CreateRole