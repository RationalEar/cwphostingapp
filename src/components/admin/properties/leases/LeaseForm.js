import React from "react";
import {days, daysOfWeek, monthsOfYear, paymentsDue, schema} from "./leaseFields";
import {Form, Formik} from "formik";
import {Alert, Button, Form as BSForm, InputGroup, Modal, Spinner} from "react-bootstrap";
import UserSelect from "../UserSelect";
import PropertySelect from "../PropertySelect";
import CurrencySelect from "../CurrencySelect";

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
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="tenantId">Tenant</label>
								<UserSelect
									id={'tenantId'}
									value={values.tenantId}
									name={'tenantId'}
									onChange={setFieldValue}
									onBlur={setFieldTouched}
									touched={touched.ownerId}
									error={errors.ownerId}
									defaultUser={lease?lease.tenant:false}
								/>
							</BSForm.Group>
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="propertyId">Property</label>
								<PropertySelect
									id={'propertyId'}
									value={values.propertyId}
									property={''}
									onChange={setFieldValue}
									onBlur={setFieldTouched}
									touched={touched.propertyId}
									error={errors.propertyId}
									defaultProperty={lease?lease.property:false}
								/>
							</BSForm.Group>
							<BSForm.Group className="col-6 mb-3" id={'startDate'}>
								<label htmlFor="startDate">Lease Start Date</label>
								<BSForm.Control type={'date'} name="startDate" value={values.startDate} onChange={handleChange} />
								<BSForm.Control.Feedback type="invalid">{errors.startDate}</BSForm.Control.Feedback>
							</BSForm.Group>
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="endDate">Lease End Date</label>
								<BSForm.Control type={'date'} name="endDate" value={values.endDate} onChange={handleChange} />
							</BSForm.Group>
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="billFrom">Start Billing From</label>
								<BSForm.Control type={'date'} name="billFrom" value={values.billFrom} onChange={handleChange} />
							</BSForm.Group>
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="currency">Currency</label>
								<CurrencySelect
									id={'currency'}
									name={'currency'}
									options={props.leaseOptions.currencies}
									value={values.currency}
									onChange={setFieldValue}
									onBlur={setFieldTouched}
									touched={touched.currency}
									error={errors.currency}
									errorMessage={errors.currency}
								/>
							</BSForm.Group>
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="deposit">Deposit Amount</label>
								<BSForm.Control id="deposit" name="deposit" type="number" step="0.01"
												onChange={handleChange}
												value={values.deposit}/>
							</BSForm.Group>
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="amount">Rental Amount</label>
								<BSForm.Control id="amount" name="amount" type="number" step="0.01"
												onChange={handleChange}
												value={values.amount}
												isInvalid={!!errors.amount}/>
								<BSForm.Control.Feedback type="invalid">{errors.amount}</BSForm.Control.Feedback>
							</BSForm.Group>
							
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="status">Status</label>
								<BSForm.Select  id="status" name="status" type="select" options={props.statuses}
												value={values.status} onChange={handleChange}
												isInvalid={!!errors.status}>
									<option>Select status</option>
									{props.leaseOptions.statuses && props.leaseOptions.statuses.map( option => {
										return <option key={option} value={option}>{option}</option>
									} )}
								</BSForm.Select>
								<BSForm.Control.Feedback type="invalid">{errors.status}</BSForm.Control.Feedback>
							</BSForm.Group>
							{/*<BSForm.Group className="col-12 mb-3">
											<label htmlFor="comments">Comments</label>
											<BSForm.Control as="textarea" name="comments[0]" value={values.comments[0]} onChange={handleChange} />
										</BSForm.Group>*/}
						</fieldset>
						
						<div className="clearfix py-2"><hr /></div>
						
						<fieldset className={'row'}>
							<legend>Payment Schedule</legend>
							
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="paymentSchedule.cycle">Bill Every</label>
								<InputGroup>
									<BSForm.Control id="paymentSchedule.repeatEvery" name="paymentSchedule.repeatEvery" type="number" step="1"
													style={{maxWidth:'70px'}}
													onChange={handleChange}
													value={values.paymentSchedule.repeatEvery}/>
									<BSForm.Select  id="paymentSchedule.cycle" name="paymentSchedule.cycle" type="select"
													value={values.paymentSchedule.cycle} onChange={handleChange}>
										<option>Select Cycle</option>
										{props.leaseOptions.paymentsCycle && props.leaseOptions.paymentsCycle.map( option => {
											return <option key={option} value={option}>
												{option}
												{values.paymentSchedule.repeatEvery>1?'S':''}
											</option>
										} )}
									</BSForm.Select>
								</InputGroup>
							
							</BSForm.Group>
							
							<BSForm.Group className={['YEAR','DECADE'].includes(values.paymentSchedule.cycle)?"col-6 mb-3":'d-none'}>
								<label htmlFor="paymentSchedule.monthOfYear">In the month of</label>
								<BSForm.Select  id="paymentSchedule.monthOfYear" name="paymentSchedule.monthOfYear" type="select"
												value={values.paymentSchedule.monthOfYear} onChange={handleChange}>
									<option>Select month</option>
									{monthsOfYear.map( (option, index) => {
										return <option key={option} value={index}>{option}</option>
									} )}
								</BSForm.Select>
							</BSForm.Group>
							
							<BSForm.Group className={['YEAR','MONTH','QUARTER', 'SEMESTER','DECADE'].includes(values.paymentSchedule.cycle)?"col-6 mb-3":'d-none'}>
								<label htmlFor="paymentSchedule.dayOfMonth">On the</label>
								<BSForm.Select  id="paymentSchedule.dayOfMonth" name="paymentSchedule.dayOfMonth" type="select"
												value={values.paymentSchedule.dayOfMonth} onChange={handleChange}>
									<option>Select day</option>
									{days.map( (option, index) => {
										return <option key={option} value={index}>{option}</option>
									} )}
								</BSForm.Select>
							</BSForm.Group>
							
							<BSForm.Group className={['WEEK', 'FORTNIGHT'].includes(values.paymentSchedule.cycle)?"col-6 mb-3":'d-none'}>
								<label htmlFor="paymentSchedule.dayOfWeek">On</label>
								<BSForm.Select  id="paymentSchedule.dayOfWeek" name="paymentSchedule.dayOfWeek" type="select"
												value={values.paymentSchedule.dayOfWeek} onChange={handleChange}>
									{daysOfWeek.map( (option, index) => {
										return <option key={option} value={index}>{option}</option>
									} )}
								</BSForm.Select>
							</BSForm.Group>
							
							{/*<BSForm.Group className={ 'HOUR' === values.paymentSchedule.cycle ?"col-6 mb-3":'d-none'}>
								<label htmlFor="paymentSchedule.hour">At</label>
								<BSForm.Control type={'time'} name="paymentSchedule.hour" step={3600} value={values.paymentSchedule.hour} onChange={handleChange} />
							</BSForm.Group>*/}
							
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="dueIn">Payments Due</label>
								<BSForm.Select  id="dueIn" name="dueIn" type="select"
												value={values.dueIn} onChange={handleChange}>
									<option>Select</option>
									{paymentsDue.map( (option) => {
										return <option key={option.label} value={option.days}>{option.label}</option>
									} )}
								</BSForm.Select>
							</BSForm.Group>
							
							<BSForm.Group className="col-6 mb-3">
								<label htmlFor="gracePeriod">Grace Period (Days)</label>
								<BSForm.Control  id="gracePeriod" name="gracePeriod" type="number" min={0} max={100} value={values.gracePeriod} onChange={handleChange} />
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

export default LeaseForm