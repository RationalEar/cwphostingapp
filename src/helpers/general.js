import {useDispatch} from "react-redux";
import {useLocation} from "react-router-dom";
import React from "react";
export const SetMessage = (message, flag) => {
	useDispatch({type: 'pushToast', payload: message, flag: flag})
}

export function get_axios_error(error){
	let msg = '';
	if (error.response) {
		console.log("error response:")
		console.log(error.response)
		msg = error.response.data.message ? error.response.data.message : error.response.data;
	}
	else if (error.request) {
		console.log("error request:")
		console.log(error.request)
		msg = error.request
	}
	else {
		console.log("error message:")
		console.log(error.message)
		msg = error.message
	}
	
	if( msg instanceof Object){
		msg = msg.message || msg.exception
	}
	
	if(error.response.data.errors){
		const errors = error.response.data.errors
		let blocks = [];
		for( const i in errors ){
			const block = '<li>'+errors[i].join('</li>')+'</li>'
			blocks.push(block)
		}
		msg += '<ul>' + blocks.join('')+'</ul>'
	}
	
	return {message: msg, status: 'warning'}
}

export function useQuery() {
	const { search } = useLocation();
	return React.useMemo(() => new URLSearchParams(search), [search]);
}