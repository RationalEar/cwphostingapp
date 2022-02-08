import {useDispatch, useSelector} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import React from "react";
import {pdfHtml} from "../components/admin/leases/pdfHtml";
export const SetMessage = (message, flag) => {
	useDispatch({type: 'pushToast', payload: message, flag: flag})
}

export const useIsAdmin = () => {
	const profile = useSelector((state) => state.profile)
	return profile && (profile.role.name==='ADMIN' || profile.role.name==='SUPER_ADMIN' )
}

export const useIsAdminPath = () => {
	const history = useHistory()
	return useIsAdmin() && history.location.pathname.includes('/admin/')
}

export function get_axios_error(error){
	let msg = '';
	if (error.response) {
		const r = error.response
		console.log("error response:")
		console.log(error.response)
		msg = r.data.message ? r.data.message : r.data;
		if(msg===undefined || msg===null || msg===''){
			switch (r.status){
				case 403 :
					msg = "You do not have permission to access this resource"
					break
				case 401:
					msg = "The requested resource could not be found"
					break
				default:
					msg = "Unknown error. The server return error code "+r.status
					break
			}
			
		}
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

export const convertSort = (data) => {
	let sortObj = data;
	if( data && (typeof data === 'string' || data instanceof String) ){
		const exploded = data.split(':');
		if(exploded && exploded.length > 1){
			sortObj = {field: exploded[0], dir: exploded[1]}
			return sortObj;
		}
	}
	return { field: 'created', dir: 'desc' }
}

export const leftPad = (num, length) => {
	return num.toString().padStart(length, 0);
}

export const generatePdf = (frameRef, fileName) => {
	const doc = frameRef.current.contentWindow.document
	const body = doc.body
	const canvases = doc.querySelectorAll('.canvas')
	canvases.forEach( (div)=>{
		const canvas = div.querySelector('canvas')
		if(canvas){
			const src = canvas.toDataURL('image/png', 1.0)
			div.innerHTML = '<img alt="canvas" src="'+src+'" />'
		}
	})
	const html = pdfHtml.replace('HTML_BODY', body.innerHTML)
	window.axios.post('report/pdf', {name: fileName, html:html})
		.then(response=>{
			downloadPdf(response.data, fileName)
		})
		.catch(error=>{
			console.log(error)
		})
}

const downloadPdf = (file, fileName) => {
	window.axios.get('report/pdf?file='+file, {responseType: 'arraybuffer', headers: {'Accept': 'application/pdf'}})
		.then(response=>{
			const file = 'tenant-report-'+fileName.substr(0,8)+'.pdf'
			
			const blob = new Blob([response.data], { type: 'application/pdf' })
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', file);
			const links = document.getElementById("download-link");
			links.appendChild(link);
			link.click();
			links.innerHTML = ''
		})
		.catch(error=>{
			console.log(error)
		})
}