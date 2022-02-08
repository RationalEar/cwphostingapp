import React from "react";
import {Form, Formik} from "formik";
import {Alert, Button, Spinner} from "react-bootstrap";
import LeaseDetailsFields from "../../admin/leases/LeaseDetailsFields";
import PaymentScheduleFields from "../../admin/leases/PaymentScheduleFields";
import {schema} from "../../admin/leases/leaseFields";

function LeaseForm(props){
	const lease = props.lease ? props.lease : false
	const tenant = props.tenant ? props.tenant : false
	const handleSubmit = (values, FormikBag) => {
		props.handleSubmit(values, FormikBag)
	}
	
	return(
		<Formik initialValues={props.initialValues} onSubmit={(values, FormikBag) => handleSubmit(values, FormikBag)} validationSchema={schema}>
			{({errors, values, handleChange, isSubmitting,
				  setFieldValue, setFieldTouched, touched}) => (
				<Form noValidate className="g-3">
						{ props.alert && <Alert variant={'warning'} onClose={() => props.setAlert('')} dismissible>{props.alert}</Alert> }
						<fieldset className={'row'}>
							<LeaseDetailsFields lease={lease} leaseOptions={props.leaseOptions} tenant={tenant}
												handleChange={handleChange} values={values} errors={errors}
												setFieldTouched={setFieldTouched} touched={touched} setFieldValue={setFieldValue}
							/>
						</fieldset>
						
						<div className="clearfix py-2"><hr /></div>
						
						<fieldset className={'row'}>
							<legend>Payment Schedule</legend>
							<PaymentScheduleFields values={values} leaseOptions={props.leaseOptions} handleChange={handleChange} />
						</fieldset>
					
					<fieldset style={{borderTop: 'none'}}>
						{isSubmitting ? <Button variant="primary" className="float-end" disabled>
							<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> {props.buttonText}
						</Button> : <Button type="submit" variant="primary" className="float-end"><i className="bx bxs-save"/>{props.buttonText}</Button> }
					</fieldset>
				</Form>
			)}
		</Formik>
	)
}

export default LeaseForm