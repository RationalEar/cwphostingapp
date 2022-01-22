import React, {useCallback, useEffect, useMemo, useState} from "react";
import AsyncSelect from "react-select/async";
import {debounce} from "lodash";
import {Form as BSForm} from "react-bootstrap";

function PropertySelect(props) {
	
	const property = useMemo(()=>{
		const p = props.defaultProperty
		const address = p.address
		return props.defaultProperty ? p.name + ' ' + address.addressLine1 + ' '+address.addressLine2+', '+address.city
			: (props.value?props.value:'')
	}, [props.defaultProperty, props.value])
	const [loaded, setLoaded] = useState()
	
	const options = useMemo(() => (props.value ? [{ value: props.value, label: property }] : []), [property, props.value] )
	const defaultValue = props.value ? { value: props.value, label: property } : null
	
	const [defaultOptions, setDefaultOptions] = useState(options)
	
	const handleChange = data => {
		// this is going to call setFieldValue and manually update values.propertyId
		props.onChange('propertyId', data.value);
	};
	
	const handleBlur = () => {
		// this is going to call setFieldTouched and manually update touched.propertyId
		props.onBlur('propertyId', true);
	};
	
	
	const search = debounce((searchTerm, callback)=>{
		getProperties(searchTerm).then(response => {
			const items = response.data.items ? response.data.items : []
			const properties = items.map(p => ({
					value: p.id,
					label: p.name + ' ' + p.address.addressLine1 + ' ' + p.address.addressLine2 + ', '+p.address.city
				})
			)
			callback(properties);
		})
	}, 800, {trailing: true})
	
	const getProperties = (filter) => {
		let params
		if(filter) params = {filter:filter, page: 0, limit: 20, sort: 'relevance:desc'}
		else params = { page: 0, limit: 50, sort: 'created:desc'}
		return window.axios.get('properties', {params:params});
	}
	
	const getDefaultProperties = useCallback((filter) => {
		if(!loaded) setLoaded(true)
		const params = { page: 0, limit: 50, sort: 'created:desc'}
		window.axios.get('properties', {params:params})
			.then(response=>{
				const items = response.data.items ? response.data.items : []
				const properties = items.map(p=>({
					value: p.id,
					label: p.name + ' ' + p.address.addressLine1 + ' ' + p.address.addressLine2 + ', '+p.address.city
				}))
				setDefaultOptions([...options, ...properties])
			})
	},[loaded, options])
	
	useEffect(()=>{
		let isSubscribed = true;
		if(isSubscribed && !loaded){
			getDefaultProperties()
		}
		return () => (isSubscribed = false)
	},[loaded, getDefaultProperties])
	
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
				placeholder="Search by name, address or owner email"
			/>
			{!!props.error && props.touched && (
				<BSForm.Control.Feedback type="invalid">You need to select property</BSForm.Control.Feedback>
			)}
		</React.Fragment>
	);
	
}

export default PropertySelect