import React from "react";
import {Form as BSForm, InputGroup} from "react-bootstrap";
import {days, daysOfWeek, monthsOfYear, paymentsDue} from "./leaseFields";

const PaymentScheduleFields = ({values, handleChange, leaseOptions}) => {
	return(
		<React.Fragment>
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
						{leaseOptions.paymentsCycle && leaseOptions.paymentsCycle.map( option => {
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
		</React.Fragment>
	)
}

export default PaymentScheduleFields