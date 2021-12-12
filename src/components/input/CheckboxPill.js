import React, {useState} from "react";
import {Field, useField} from "formik";

function CheckboxPill (props){
	const [field] = useField(props);
	const [checked, setChecked] = useState(!!props.defaultChecked)
	const v = props.variant || 'outline'
	const d = "btn badge rounded-pill py-2 px-4 "
	
	const toggle = (checked) => {
		setChecked(checked);
		if(checked){
			props.onAdd()
		}
		else{
			props.onRemove()
		}
	}
	
	return (
		<span className={props.className + ' d-inline-block'}>
			<button type="button" className={checked ? d+'btn-'+v : d+'btn-outline-secondary text-dark'} onClick={()=>toggle(!checked)} style={{fontSize: "1em"}}>
				{props.children}
			</button>
			<Field type="checkbox" {...field} style={{display: 'none'}}  checked={checked} />
		</span>
	)
}

export default CheckboxPill