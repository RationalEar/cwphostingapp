import React from "react";
import AsyncSelect from "react-select/async";
import {debounce} from "lodash";
import {Form as BSForm} from "react-bootstrap";

function UserSelect(props) {
	const owner = props.owner ? props.owner.firstName + ' ' + props.owner.lastName + ' ('+props.owner.email+')'
		: (props.value?props.value:'')
	
	const options = props.value ? [{ value: props.value, label: owner }] : []
	const defaultValue = props.value ? { value: props.value, label: owner } : null
	
	const handleChange = data => {
		// this is going to call setFieldValue and manually update values.ownerId
		props.onChange('ownerId', data.value);
	};
	
	const handleBlur = () => {
		// this is going to call setFieldTouched and manually update touched.ownerId
		props.onBlur('ownerId', true);
	};
	
	
	const search = debounce((searchTerm, callback)=>{
		getUsers(searchTerm).then(response => {
			const items = response.data.items ? response.data.items : []
			const users = items.map(user => ({
					value: user.id,
					label: user.firstName + ' ' + user.lastName + ' (' + user.email + ')'
				})
			)
			callback(users);
		})
	}, 800, {trailing: true})
	
	const getUsers = (filter) => {
		let params = {}
		if(filter) params = {filter:filter, page: 0, limit: 20, sort: 'relevance:desc'}
		else params = { page: 0, limit: 20, sort: 'created:desc'}
		return window.axios.get('users', {params:params});
	}
	
	return (
		<React.Fragment>
			<AsyncSelect
				defaultOptions={options}
				cacheOptions
				onChange={handleChange}
				onBlur={handleBlur}
				defaultValue={defaultValue}
				loadOptions={search}
				className={ !!props.error ? 'is-invalid' : '' }
				placeholder="Search by name or email"
			/>
			{!!props.error && props.touched && (
				<BSForm.Control.Feedback type="invalid">You need to select an owner</BSForm.Control.Feedback>
			)}
		</React.Fragment>
	);
	
}

export default UserSelect