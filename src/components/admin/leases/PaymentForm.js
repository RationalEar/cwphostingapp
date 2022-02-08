import React from "react";
import {paymentSchema} from "./leaseFields";
import {Form, Formik} from "formik";
import {Alert, Button, Form as BSForm, Modal, Spinner} from "react-bootstrap";
import CurrencySelect from "../properties/CurrencySelect";
import {ShortDateString} from "./leaseFields";

function PaymentForm(props){
	const handleSubmit = (values, FormikBag) => {
		props.handleSubmit(values, FormikBag)
	}
	
	return(
		<Formik initialValues={props.initialValues} onSubmit={(values, FormikBag) => handleSubmit(values, FormikBag)} validationSchema={paymentSchema}>
			{({errors, values, handleChange, isSubmitting,
				  setFieldValue, setFieldTouched, touched}) => (
				<Form noValidate className="g-3">
					<Modal.Header closeButton>
						<Modal.Title>{props.title}</Modal.Title>
					</Modal.Header>
					<Modal.Body className="m-0">
						{ props.alert && <Alert variant={'warning'} onClose={() => props.setAlert('')} dismissible>{props.alert}</Alert> }
						<fieldset className={'row'}>
							<BSForm.Group className="col-6 mb-3">
								<label>Invoice Date</label>
								<div className="form-control text-muted fw-bold"><ShortDateString date={props.invoice.invoiceDate} /></div>
							</BSForm.Group>
							<BSForm.Group className="col-6 mb-3">
								<label>Due Date</label>
								<div className="form-control text-muted fw-bold"><ShortDateString date={props.invoice.invoiceDueDate} /></div>
							</BSForm.Group>
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="currency">Currency</label>
								<CurrencySelect
									id={'currency'}
									name={'currency'}
									options={props.currencies}
									value={values.currency}
									onChange={setFieldValue}
									onBlur={setFieldTouched}
									touched={touched.currency}
									error={errors.currency}
									errorMessage={errors.currency}
								/>
							</BSForm.Group>
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="amount">Amount Paid</label>
								<BSForm.Control id="amount" name="amount" type="number" step="0.01"
												onChange={handleChange}
												value={values.amount}
												isInvalid={!!errors.amount}/>
								<BSForm.Control.Feedback type="invalid">{errors.amount}</BSForm.Control.Feedback>
							</BSForm.Group>
							<BSForm.Group className="col-6 mb-3" id={'paymentDate'}>
								<label htmlFor="paymentDate">Payment date</label>
								<BSForm.Control type={'datetime-local'} name="paymentDate" value={values.paymentDate} onChange={handleChange} />
								<BSForm.Control.Feedback type="invalid">{errors.paymentDate}</BSForm.Control.Feedback>
							</BSForm.Group>
							<BSForm.Group className={'col-6 mb-3'} id={'paymentMethod'}>
								<label htmlFor={'paymentMethod'}>Payment Method</label>
								<BSForm.Select name={'paymentMethod'} value={values.paymentMethod} onChange={handleChange}>
									<option value="">-- select option --</option>
									{props.paymentMethods.map(pm=>{
										return (
											<option key={pm} value={pm}>{pm}</option>
										)
									})}
								</BSForm.Select>
							</BSForm.Group>
							<BSForm.Group className={values.currency===props.invoice.currency?'d-none':"col-6 mb-3"}>
								<label htmlFor="exchangeRate">Exchange Rate</label>
								<BSForm.Control id="exchangeRate" name="exchangeRate" type="number" step="0.0001"
												onChange={handleChange}
												value={values.exchangeRate}/>
								<div className="form-text">
									{props.invoice.currency} 1 = {values.exchangeRate} {values.currency}
								</div>
							</BSForm.Group>
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="confirmed">Payment Confirmed</label>
								<BSForm.Check id="confirmed" name="confirmed" type="switch" checked={values.confirmed} label={values.confirmed?'Yes':'No'}
												value={values.confirmed} onChange={handleChange}
												>
								</BSForm.Check>
							</BSForm.Group>
							<BSForm.Group className="col-12 mb-3">
											<label htmlFor="comment">Comment</label>
											<BSForm.Control as="textarea" name="comment" id={'comment'} value={values.comment} onChange={handleChange} />
										</BSForm.Group>
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

export default PaymentForm