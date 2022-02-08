import {Card, Form as BSForm, FormLabel, InputGroup} from "react-bootstrap";
import {Field} from "formik";
import React from "react";

const OrderPayment = ({values,errors,handleChange}) => {
	return(
		<fieldset className={'row mt-3'}>
			<Card.Title className="d-flex align-items-center">
				<h5 className="mb-0 text-danger">Payment Details</h5>
			</Card.Title>
			<hr />
			<BSForm.Group className="col-12 mb-3 fs-5">
				<div role="group" aria-labelledby="radio-group">
					<div className="form-check form-check-inline">
						<Field className="form-check-input" type="radio" name="currency" value="ZWD" id="currency.ZWD"/>
						<label className="form-check-label" htmlFor="currency.ZWD">ZWL</label>
					</div>
					<div className="form-check form-check-inline">
						<Field className="form-check-input" type="radio" name="currency" value="USD" id="currency.USD"/>
						<label className="form-check-label" htmlFor="currency.USD">USD</label>
					</div>
				</div>
				<BSForm.Control.Feedback type="invalid">{errors.currency}</BSForm.Control.Feedback>
			</BSForm.Group>
			<BSForm.Group className="col-12 mb-3">
				<FormLabel htmlFor="deposit">Select Payment Method:</FormLabel>
				{values.currency==='ZWD' && <div role="group" aria-labelledby="radio-group">
					<div className="form-check form-check-inline">
						<Field className="form-check-input" type="radio" name="paymentMethod" value="ECOCASH" id="paymentMethod.ECOCASH"/>
						<label className="form-check-label" htmlFor="paymentMethod.ECOCASH">Ecocash</label>
					</div>
					<div className="form-check form-check-inline">
						<Field className="form-check-input" type="radio" name="paymentMethod" value="ONEMONEY" id="paymentMethod.ONEMONEY"/>
						<label className="form-check-label" htmlFor="paymentMethod.ONEMONEY">OneMoney</label>
					</div>
					<div className="form-check form-check-inline">
						<Field className="form-check-input" type="radio" name="paymentMethod" value="PAYNOW" id="paymentMethod.PAYNOW"/>
						<label className="form-check-label" htmlFor="paymentMethod.PAYNOW">Pay Online (ZimSwitch/Visa/Mastercard)</label>
					</div>
					{['ECOCASH','ONEMONEY'].includes(values.paymentMethod) && <BSForm.Group className="col-6 mb-3 mt-3" id={'startDate'}>
						<label htmlFor="mobileMoneyNumber" className="form-label">{values.paymentMethod.toLocaleString()} Phone Number</label>
						<InputGroup hasValidation>
							<span className="input-group-text bg-transparent"><i className="bx bx-phone"/></span>
							<BSForm.Control onChange={handleChange} type={'phone'} name="mobileMoneyNumber" id="mobileMoneyNumber" placeholder="Phone Number"
											value={values.mobileMoneyNumber} isInvalid={errors.user && !!errors.mobileMoneyNumber}/>
							<BSForm.Control.Feedback type="invalid">{errors.mobileMoneyNumber}</BSForm.Control.Feedback>
						</InputGroup>
					</BSForm.Group>}
				</div>}
				
				{values.currency==='USD' && <div role="group" aria-labelledby="radio-group">
					<h4>There are currently no USD payment methods.</h4>
				</div>}
				
				<BSForm.Control.Feedback type="invalid">{errors.paymentMethod}</BSForm.Control.Feedback>
			</BSForm.Group>
		
		</fieldset>
	)
}

export default OrderPayment