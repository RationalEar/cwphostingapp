import React from "react";
import {schema} from "./leaseFields";
import {Form, Formik} from "formik";
import {Alert, Button, Modal, Spinner} from "react-bootstrap";
import PaymentScheduleFields from "./PaymentScheduleFields";
import LeaseDetailsFields from "./LeaseDetailsFields";

function LeaseForm(props){
	const lease = props.lease ? props.lease : false
	const handleSubmit = (values, FormikBag) => {
		props.handleSubmit(values, FormikBag)
	}
	
	return(
		<Formik initialValues={props.initialValues} onSubmit={(values, FormikBag) => handleSubmit(values, FormikBag)} validationSchema={schema}>
			{({errors, values, handleChange, isSubmitting,
				  setFieldValue, setFieldTouched, touched}) => (
				<Form noValidate className="g-3">
					<Modal.Header closeButton>
						<Modal.Title>{props.title}</Modal.Title>
					</Modal.Header>
					<Modal.Body className="m-0">
						{ props.alert && <Alert variant={'warning'} onClose={() => props.setAlert('')} dismissible>{props.alert}</Alert> }
						<fieldset className={'row'}>
							<LeaseDetailsFields lease={lease} leaseOptions={props.leaseOptions}
												handleChange={handleChange} values={values} errors={errors}
												setFieldTouched={setFieldTouched} touched={touched} setFieldValue={setFieldValue}
							/>
						</fieldset>
						
						<div className="clearfix py-2"><hr /></div>
						
						<fieldset className={'row'}>
							<legend>Payment Schedule</legend>
							<PaymentScheduleFields values={values} leaseOptions={props.leaseOptions} handleChange={handleChange} />
						</fieldset>
					</Modal.Body>
					<Modal.Footer style={{borderTop: 'none'}}>
						{isSubmitting ? <Button variant="primary" disabled>
							<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> {props.buttonText}
						</Button> : <Button type="submit" variant="primary"><i className="bx bxs-save"/>{props.buttonText}</Button> }
						<Button variant="secondary" onClick={props.hide}>Close</Button>
					</Modal.Footer>
				</Form>
			)}
		</Formik>
	)
}

export default LeaseForm