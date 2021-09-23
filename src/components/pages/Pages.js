import React, {useEffect, useState} from 'react';
import Breadcrumbs from "../misc/Breadcrumbs";
import {Link} from "react-router-dom";
import {debounce} from "lodash";

function Pages(props) {
	const [mounted, setMounted] = useState(false)
	const [total, setTotal] = useState(0)
	const [items, setItems] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	
	useEffect(()=>{
		if(!mounted){
			setMounted(true)
			getPages()
		}
	}, [mounted])
	
	
	const StatusPill = (props) => {
		if(props.status) return (
			<div
				className="badge rounded-pill text-success bg-light-success p-2 text-uppercase px-3">
				<i className='bx bxs-circle me-1'/>Enabled
			</div>
		)
		
		else return (
			<div
				className="badge rounded-pill text-dark bg-light p-2 text-uppercase px-3">
				<i className='bx bxs-circle me-1'/>Disabled
			</div>
		)
	}
	
	const sendRequest = debounce((term)=>{
		window.axios.get('pages/search/' + term)
			.then(response => {
				setItems(response.data)
				setTotal(response.data.length)
			})
	}, 1000, {trailing: true})
	
	const search = (e) => {
		const term = e.target.value
		setSearchTerm(term)
		if(term) sendRequest(term)
		else getPages()
	}
	
	const getPages = () => {
		window.axios.get('pages')
			.then(response=>{
				setItems(response.data)
				setTotal(response.data.length)
			})
	}
	
	return (
		<React.Fragment>
			<Breadcrumbs category={'Page Management'} title={'Pages'} />
			<div className="card">
				<div className="card-body">
					<div className="d-lg-flex align-items-center mb-4 gap-3">
						<div className="position-relative">
							<input type="text" className="form-control ps-5 radius-30" placeholder="Search items" value={searchTerm} onChange={search} />
							<span className="position-absolute top-50 product-show translate-middle-y">
								<i className="bx bx-search"/>
							</span>
						</div>
						<div className="ms-auto">
							<Link to={'/pages/create'} className="btn btn-primary radius-30 mt-2 mt-lg-0">
								<i className="bx bxs-plus-square"/>Add New Page
							</Link>
						</div>
					</div>
					<p>{total} items</p>
					<div className="table-responsive">
						<table className="table mb-0">
							<thead className="table-light">
							<tr>
								<th>ID</th>
								<th>Page Name</th>
								<th>Slug</th>
								<th>Parent Page</th>
								<th>Menu Position</th>
								<th>Status</th>
								<th>Gallery</th>
								<th>Options</th>
							</tr>
							</thead>
							<tbody>
							{items.map( item => {
								return (<tr key={item.pgId}>
									<td>{item.pgId}</td>
									<td>{item.pgName}</td>
									<td>{item.pgSlug}</td>
									<td>{item.pgParent}</td>
									<td>{item.pgMenu>=99 ? 'hidden': item.pgMenu}</td>
									<td><StatusPill status={item.pgEnabled} /> </td>
									<td><StatusPill status={item.pgGallery} /></td>
									<td>
										<div className="d-flex order-actions">
											<Link to={'/pages/edit/'+item.pgId} className=""><i className='bx bxs-edit'/></Link>
											<Link to={'/pages/remove/'+item.pgId} className="ms-3"><i className='bx bxs-trash'/></Link>
										</div>
									</td>
								</tr>)
							})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default Pages;