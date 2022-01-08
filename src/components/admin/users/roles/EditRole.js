import {Button, Form as BSForm, Modal, Spinner} from "react-bootstrap";
import React from "react";
import {Formik, Form} from "formik";
import {useDispatch} from "react-redux";
import {setError, setInfo} from "../../../../features/notifications/NotificationSlice";
import {get_axios_error} from "../../../../helpers/general";
import {roleSchema} from "../userFields";

function EditRole(props){
	const role = props.role
	const dispatch = useDispatch()
	
	const handleSubmit = (form, FormikBag) => {
		const data = Object.assign(role, form);
		window.axios.put( 'roles/'+role.id, data )
			.then( response => {
				props.onHide()
				dispatch(setInfo(response.data.message))
				if(response.data.data) props.updateRole(response.data.data)
			})
			.catch( ( error ) => {
				const e = get_axios_error(error)
				dispatch(setError(e.message))
				FormikBag.setSubmitting(false)
			})
	}
	
	const initialValues = {
		name: role.name || '',
		alias: role.alias || ''
	}
	
	
	return (
		<Modal show={props.show} onHide={props.onHide}>
			<Formik onSubmit={(values, FormikBag)=>handleSubmit(values, FormikBag)}
					validationSchema={roleSchema} initialValues={initialValues}>
				{({errors, values, handleChange, isSubmitting}) => (
					<Form noValidate className="g-3">
						<Modal.Header closeButton>
							<Modal.Title>Edit Role - {role.name} {role.alias}</Modal.Title>
						</Modal.Header>
						<Modal.Body className="m-0">
							<fieldset>
								<BSForm.Group className="col-12 mb-3">
									<label htmlFor="name">Role Name</label>
									<BSForm.Control id="name" name="name" type="text"
												  onChange={handleChange} value={values.name}
												  isInvalid={!!errors.name}/>
									<BSForm.Control.Feedback type="invalid">{errors.name}</BSForm.Control.Feedback>
								</BSForm.Group>
								<BSForm.Group className="col-12 mb-3">
									<label htmlFor="alias">Role Alias</label>
									<BSForm.Control id="alias" name="alias" type="text"
												  onChange={handleChange} value={values.alias} isInvalid={!!errors.alias}/>
									<BSForm.Control.Feedback type="invalid">{errors.alias}</BSForm.Control.Feedback>
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

export default EditRole