import React from "react";
import {Form as BSForm} from "react-bootstrap";
import UserSelect from "../properties/UserSelect";
import PropertySelect from "../properties/PropertySelect";
import CurrencySelect from "../properties/CurrencySelect";

const LeaseDetailsFields = ({values, errors, handleChange, setFieldValue, setFieldTouched, touched, lease, tenant, leaseOptions}) => {
	return (
		<React.Fragment>
			<BSForm.Group className="col-6 mb-3">
				<label htmlFor="tenantId">Tenant</label>
				{tenant ? <div className="form-control text-muted">{tenant.firstName} {tenant.lastName} ({tenant.email})</div> : <UserSelect
					id={'tenantId'}
					value={values.tenantId}
					name={'tenantId'}
					onChange={setFieldValue}
					onBlur={setFieldTouched}
					touched={touched.ownerId}
					error={errors.ownerId}
					defaultUser={lease?lease.tenant:false}
				/>}
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
					options={leaseOptions.currencies}
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
				<BSForm.Select  id="status" name="status" type="select"
								value={values.status} onChange={handleChange}
								isInvalid={!!errors.status}>
					<option>Select status</option>
					{leaseOptions.statuses && leaseOptions.statuses.map( option => {
						return <option key={option} value={option}>{option}</option>
					} )}
				</BSForm.Select>
				<BSForm.Control.Feedback type="invalid">{errors.status}</BSForm.Control.Feedback>
			</BSForm.Group>
			{/*<BSForm.Group className="col-12 mb-3">
											<label htmlFor="comments">Comments</label>
											<BSForm.Control as="textarea" name="comments[0]" value={values.comments[0]} onChange={handleChange} />
										</BSForm.Group>*/}
		</React.Fragment>
	)
}

export default LeaseDetailsFields