import React from "react";
import {Form as BSForm} from "react-bootstrap";
import Select from "react-select";

function CurrencySelect(props) {
	const name = props.name || 'currency'
	const options = props.options ? props.options.map(c => ({ value: c, label: c })) : []
	const defaultValue = props.value ? { value: props.value, label: props.value } : ''
	
	const handleChange = data => {
		// this is going to call setFieldValue and manually update values.ownerId
		props.onChange(name, data.value);
	};
	
	const handleBlur = () => {
		// this is going to call setFieldTouched and manually update touched.ownerId
		props.onBlur(name, true);
	};
	
	
	
	return (
		<React.Fragment>
			<Select
				options={options}
				onChange={handleChange}
				onBlur={handleBlur}
				defaultValue={defaultValue}
				className={ !!props.error ? 'is-invalid' : '' }
			/>
			{!!props.error && props.touched && (
				<BSForm.Control.Feedback type="invalid">{props.error || "You need to select a currency"}</BSForm.Control.Feedback>
			)}
		</React.Fragment>
	);
	
}

export default CurrencySelect