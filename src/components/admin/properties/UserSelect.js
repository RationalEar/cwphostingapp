import React, {useCallback, useEffect, useMemo, useState} from "react";
import AsyncSelect from "react-select/async";
import {debounce} from "lodash";
import {Form as BSForm} from "react-bootstrap";

function UserSelect(props) {
	const name = props.name || 'userId'
	const defaultUser = props.defaultUser ? props.defaultUser.firstName + ' ' + props.defaultUser.lastName + ' ('+props.defaultUser.email+')'
		: (props.value?props.value:'')
	const [loaded, setLoaded] = useState()
	
	const options = useMemo(()=>(props.value ? [{ value: props.value, label: defaultUser }] : []), [defaultUser, props.value])
	const defaultValue = props.value ? { value: props.value, label: defaultUser } : null
	
	const [defaultOptions, setDefaultOptions] = useState(options)
	
	const handleChange = data => {
		// this is going to call setFieldValue and manually update values.ownerId
		props.onChange(name, data.value);
	};
	
	const handleBlur = () => {
		// this is going to call setFieldTouched and manually update touched.ownerId
		props.onBlur(name, true);
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
		if(filter) params = {filter:filter, page: 0, limit: 50, sort: 'relevance:desc'}
		else params = { page: 0, limit: 50, sort: 'created:desc'}
		return window.axios.get('users', {params:params});
	}
	
	const getDefaultUsers = useCallback((filter) => {
		if(!loaded) setLoaded(true)
		const params = { page: 0, limit: 50, sort: 'created:desc'}
		window.axios.get('users', {params:params})
			.then(response=>{
				const items = response.data.items ? response.data.items : []
				const users = items.map(user=>({
					value: user.id,
					label: user.firstName + ' ' + user.lastName + ' (' + user.email + ')'
				}))
				setDefaultOptions([...options, ...users])
			})
	},[loaded, options])
	
	useEffect(()=>{
		let isSubscribed = true;
		if(isSubscribed && !loaded){
			getDefaultUsers()
		}
		return () => (isSubscribed = false)
	},[loaded, getDefaultUsers])
	
	return (
		<React.Fragment>
			<AsyncSelect
				defaultOptions={defaultOptions}
				cacheOptions
				onChange={handleChange}
				onBlur={handleBlur}
				defaultValue={defaultValue}
				loadOptions={search}
				className={ !!props.error ? 'is-invalid' : '' }
				placeholder="Search by name or email"
			/>
			{!!props.error && props.touched && (
				<BSForm.Control.Feedback type="invalid">{props.error || 'You need to select an defaultUser'}</BSForm.Control.Feedback>
			)}
		</React.Fragment>
	);
	
}

export default UserSelect