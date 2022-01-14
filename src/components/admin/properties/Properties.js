import React, {useCallback, useEffect, useState} from 'react';
import Breadcrumbs from "../../misc/Breadcrumbs";
import {debounce} from "lodash";
import Pagination from "../../common/Pagination";
import PageLimit from "../../common/PageLimit";
import '../users/Users.css'
import {Button, Spinner} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {setInfo, setWarning} from "../../../features/notifications/NotificationSlice";
import {convertSort, get_axios_error, useQuery} from "../../../helpers/general";
import {useHistory} from "react-router-dom";
import CreateProperty from "./CreateProperty";
import EditProperty from "./EditProperty";
import ViewProperty from "./ViewProperty";

function Properties() {
	
	const history = useHistory()
	const query = useQuery();
	const [items, setItems] = useState([])
	const [statuses, setStatuses] = useState([])
	const [pageCount, setPageCount] = useState(0)
	const [pageLimit, setPageLimit] = useState(query.get('limit') || 10 )
	const [pageOffset, setPageOffset] = useState(query.get('page') || 0)
	const [totalItems, setTotalItems] = useState(0)
	const [sort, setSort] = useState(convertSort(query.get('sort')))
	const [filter, setFilter] = useState(query.get('filter') ||'')
	const [property, setProperty] = useState(null)
	const [relevance, setRelevance] = useState(false)
	const [loading, setLoading] = useState(false)
	const [fetched, setFetched] = useState(false)
	
	const [show, setShow] = useState(false)
	const [modal, setModal] = useState('')
	const handleClose = () => {
		setShow(false)
	}
	const handleShow = () => setShow(true)
	
	const dispatch = useDispatch()
	
	const onUpdateProperty = u => {
		const list = JSON.parse(JSON.stringify(items))
		const index = list.findIndex( item => item.id === u.id )
		if (index >= 0) {
			setItems( prevState => {
				prevState[index] = u
				return prevState
			})
		}
	}
	
	const updateHistory = useCallback((field, value) => {
		if(value==null || value===''){
			query.delete(field)
			if(field==='filter'){
				query.delete('sort')
				setSort(convertSort(false))
			}
		}
		else query.set(field, value)
		const search = query.toString()
		const page = query.get("page")
		if(field === 'page' && page===value){
			// do nothing
			// console.log("field = "+field+", value = "+value)
		}
		// else {
		history.push({
			pathname: window.location.pathname,
			search: search
		})
		setFetched(false)
		// }
	},[history, query])
	
	const getProperties = useCallback((limit=false) => {
		setFetched(true)
		// const search = query.toString()
		let page = query.get("page")
		// console.log("Query String: ", search)
		setLoading(true)
		if(limit===false) limit = pageLimit
		let sortObj = sort;
		if( sort && (typeof sort === 'string' || sort instanceof String) ){
			const exploded = sort.split(':');
			if(exploded && exploded.length > 1){
				sortObj = {field: exploded[0], dir: exploded[1]}
			}
		}
		if(page===null || page===false) page = pageOffset
		const params = { page: page, limit: limit, sort: sortObj.field + ':' + sortObj.dir}
		if(filter) params.filter = filter
		else setRelevance(false)
		window.axios.get('properties', {params:params})
			.then(response=>{
				setItems(response.data.items)
				setPageCount(response.data.totalPages)
				const currentPage = response.data.currentPage <= response.data.totalPages ? response.data.currentPage : 0
				//updateHistory('page', currentPage)
				setPageOffset(currentPage)
				// console.log("Current Page = ", currentPage)
				// console.log("Page Offset = ", pageOffset)
				setTotalItems(response.data.totalItems)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				console.log(msg)
				dispatch(setWarning( msg.message ))
			})
			.finally(()=>{
				setLoading(false)
			})
	},[dispatch, filter, pageLimit, pageOffset, query, sort])
	
	const getStatuses = useCallback(()=>{
		window.axios.get("properties/statuses")
			.then(response=>{
				setStatuses(response.data)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
		
	},[dispatch])
	
	const deleteProperty = (p) => {
		const yes = window.confirm('Are you sure you want to delete the property '+p.name+'?')
		if(yes){
			window.axios.delete('properties', {params: {id: p.id}})
				.then(response => {
					// console.log(response.data)
					dispatch(setInfo(response.data.message))
					setFetched(false)
				})
				.catch(error => {
					console.log(error)
				})
		}
	}
	
	useEffect(()=>{
		if(!fetched){
			getProperties()
			getStatuses()
		}
	}, [getProperties, getStatuses, fetched])
	
	const viewProperty = (u) => {
		setModal('view')
		setProperty(u)
		handleShow(true)
	}
	
	const editProperty = (u) => {
		setModal('edit')
		setProperty(u)
		handleShow(true)
	}
	
	const createProperty = () => {
		setModal('new')
		handleShow(true)
	}
	
	const PropertyModal = function (){
		if(property){
			return (
				modal==='view' ? <ViewProperty property={property} onHide={handleClose} show={show} editProperty={editProperty} /> : null
			)
		}
		else return null
	}
	
	const EditModal = function (){
		if(property){
			if(property.address===null){
				property.address = {
					addressLine1: '', addressLine2: '', city: '', country: '', postcode: ''
				}
			}
			return (
				modal==='edit' ? <EditProperty property={property} onHide={handleClose} show={show} updateProperty={onUpdateProperty} statuses={statuses} /> : null
			)
		}
		else return null
	}
	
	const CreatePropertyModal = function (){
		return modal==='new' ? <CreateProperty onHide={handleClose} show={show} statuses={statuses} onRefresh={()=>reloadPage()} /> : null
	}
	
	const DateString = (props) => {
		let date = new Date(props.date)
		return (
			date.toLocaleString()
		)
	}
	
	const PropertyRow = (props) => {
		const property = props.property
		return(
			<tr>
				<td>
					<div className="d-flex align-items-center">
						<div>
							<input className="form-check-input me-3" type="checkbox" value="" aria-label="..." />
						</div>
						<div className="ms-2">
							<h6 className="mb-0 font-14">{property.id.substr(0,6)}</h6>
						</div>
					</div>
				</td>
				<td>{property.name}</td>
				<td>
					{property.owner?property.owner.firstName+' '+property.owner.lastName :
					<span className="bg-light-info p-1 d-inline-block rounded" onClick={() => editProperty(property)}>update to <br/>view owner</span> }
				</td>
				{/*<td>{property.description}</td>*/}
				<td>
					{property.address.addressLine1 ? <p className="mb-0">{property.address.addressLine1}</p> : null}
					{property.address.addressLine2 ? <p className="mb-0">{property.address.addressLine2}</p> : null}
					{property.address.city || property.address.country ?
						<p className="mb-0">{property.address.city}{(property.address.city && property.address.country) && ',' } {property.address.country}</p> : null}
				</td>
				<td>{property.status}</td>
				<td>
					<DateString date={property.created} />
				</td>
				<td>
					<Button className="btn btn-primary btn-sm radius-30 px-4" onClick={() => viewProperty(property)}>
						View Details
					</Button>
				</td>
				<td>
					<div className="d-flex order-actions">
						<Button variant={'light'} className="btn-sm" title="Edit property" onClick={() => editProperty(property)}><i className='bx bxs-edit mx-0'/></Button>
						&nbsp;
						<Button variant={'light'} className="btn-sm" title="Delete property" onClick={() => deleteProperty(property)}><i className='bx bxs-trash mx-0'/></Button>
					</div>
				</td>
			</tr>
		)
	}
	
	const search = debounce((term)=>{
		setFilter(term)
		const filter = query.get("filter")
		if(!filter) query.set("page", 0)
		updateHistory("filter", term)
	}, 800, {trailing: true})
	
	const handleSearchChange = (e) => {
		const term = e.target.value
		search(term)
	}
	
	const handlePageClick = (event) => {
		// console.log('page clicked')
		updateHistory("page", event.selected)
		//getProperties(event.selected)
	}
	
	const updatePageLimit = (l) => {
		setPageLimit(l)
		updateHistory("limit", l)
	}
	
	const tableHeader = [
		{ field: 'id', title: 'Property #', sort: false },
		{ field: 'name', title: 'Name', sort: true},
		{ field: 'owner', title: 'Owner', sort: true},
		// { field: 'description', title: 'Description', sort: true},
		{ field: 'address', title: 'Address', sort: true},
		{ field: 'status', title: 'Status', sort: false},
		{ field: 'created', title: 'Date Created', sort: true },
		{ field: 'details', title: 'View Details', sort: false},
		{ field: 'actions', title: 'Actions', sort: false}
	]
	
	const changeSort = (field) => {
		setRelevance(false)
		if( field === sort.field ){
			const dir = sort.dir==='asc' ? 'desc' : 'asc';
			setSort({ field: field, dir: dir })
			updateHistory( "sort", field + ":" + dir )
		}
		else{
			updateHistory( "sort", field + ":asc" )
			setSort({ field: field, dir: 'asc' })
		}
	}
	
	const searchSort = ()=>{
		updateHistory( "sort",  "relevance:desc" )
		setSort({ field: 'relevance', dir: 'desc' })
		setRelevance(true)
	}
	
	const SortIcon = props => {
		if(props.sort){
			if( props.field === sort.field ){
				const dir = sort.dir==='desc' ? 'bx bx-sort-down' : 'bx bx-sort-up'
				return (
					<span className="hover" title={'Click to sort by '+props.title} onClick={() => changeSort(props.field)}>
						{props.title} <i className={'fadeIn animated '+dir} />
					</span>
				)
			}
			else return (
				<span className="hover" title={'Click to sort by '+props.title} onClick={() => changeSort(props.field)}>
					{props.title}
				</span>
			)
		}
		else return <span>{props.title}</span>
	}
	
	function reloadPage() {
		setFetched(false)
	}
	
	return (
		<React.Fragment>
			<Breadcrumbs category={'Property Management'} title={'Properties'} />
			<div className="card">
				<div className="card-body">
					<div className="d-lg-flex align-items-center mb-4 gap-3">
						<div className="position-relative">
							<input type="search" className="form-control ps-5 radius-30" placeholder="Search by name/email"
								   onChange={handleSearchChange} onCancel={()=>setFilter(false)} defaultValue={filter} />
							<span className="position-absolute top-50 product-show translate-middle-y">
								<i className="bx bx-search"/>
							</span>
						</div>
						{filter && <span>
							<Button type={'button'} variant={'link'} className="btn-sm text-decoration-none" onClick={searchSort}>
								Sort by relevance {relevance && <i className="bx bx-sort-down"/>}
							</Button>
						</span>}
						<PageLimit setPageLimit={updatePageLimit} pageLimit={pageLimit} />
						<Button type={'button'} variant={'light'} title="Reload" onClick={reloadPage}>
							{loading ? <Spinner as="span" animation={"border"} size={"sm"} aria-hidden="true"/>:<span className='bx bx-revision' style={{fontWeight:'bold'}}/>}
						</Button>
						<div className="ms-auto">
							<button type={'button'} className="btn btn-primary radius-30 mt-2 mt-lg-0" onClick={createProperty}>
								<i className="bx bxs-plus-square"/>Add New Property
							</button>
						</div>
					</div>
					<div className="table-responsive">
						<table className="table mb-0">
							<thead className="table-light">
							<tr>
								{tableHeader.map( td => {
									return(
										<th key={td.field}>
											<SortIcon {...td}/>
										</th>
									)
								})}
							</tr>
							</thead>
							<tbody>
							{items.map(property => {
								return (
									<PropertyRow property={property} key={property.id}/>
								)
							})}
							</tbody>
						</table>
					</div>
					
					{pageCount>0?<Pagination
						handlePageClick={handlePageClick}
						pageCount={pageCount} pageLimit={pageLimit} pageOffset={pageOffset}
						totalItems={totalItems} currentItems={items.length}
					/>:null}
				</div>
			</div>
			
			<PropertyModal />
			<EditModal />
			<CreatePropertyModal />
		</React.Fragment>
	);
}

export default Properties;