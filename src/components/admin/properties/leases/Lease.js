import React, {useCallback, useEffect, useState} from 'react';
import Breadcrumbs from "../../../misc/Breadcrumbs";
import {debounce} from "lodash";
import Pagination from "../../../common/Pagination";
import PageLimit from "../../../common/PageLimit";
import '../../users/Users.css'
import {Button, Spinner} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {setInfo, setWarning} from "../../../../features/notifications/NotificationSlice";
import {convertSort, get_axios_error, useQuery} from "../../../../helpers/general";
import {NavLink, useHistory} from "react-router-dom";
import CreateLease from "./CreateLease";
import EditLease from "./EditLease";
import ViewLease from "./ViewLease";
import {PaymentSchedule, ShortDateString} from "./leaseFields";

function Lease() {
	const history = useHistory()
	const query = useQuery();
	const [items, setItems] = useState([])
	const [leaseOptions, setLeaseOptions] = useState([])
	const [pageCount, setPageCount] = useState(0)
	const [pageLimit, setPageLimit] = useState(query.get('limit') || 10 )
	const [pageOffset, setPageOffset] = useState(query.get('page') || 0)
	const [totalItems, setTotalItems] = useState(0)
	const [sort, setSort] = useState(convertSort(query.get('sort')))
	const [filter, setFilter] = useState(query.get('filter') ||'')
	const [lease, setLease] = useState(null)
	const [relevance, setRelevance] = useState(false)
	const [loading, setLoading] = useState(false)
	const [fetched, setFetched] = useState(false)
	const [leaseOptionsFetched, setLeaseOptionsFetched] = useState(false)
	
	const [show, setShow] = useState(false)
	const [modal, setModal] = useState('')
	const handleClose = () => {
		setModal('')
		setShow(false)
	}
	const handleShow = () => setShow(true)
	
	const dispatch = useDispatch()
	
	const onUpdateLease = u => {
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
	
	const getLeases = useCallback((limit=false) => {
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
		window.axios.get('lease', {params:params})
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
	
	const getLeaseOptions = useCallback(()=>{
		setLeaseOptionsFetched(true)
		window.axios.get("lease/config")
			.then(response=>{
				setLeaseOptions(response.data)
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
			})
		
	},[dispatch])
	
	const deleteLease = (p) => {
		const yes = window.confirm('Are you sure you want to delete the lease '+p.name+'?')
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
			getLeases()
		}
		if(!leaseOptionsFetched){
			getLeaseOptions()
		}
	}, [getLeases, fetched, getLeaseOptions, leaseOptionsFetched])
	
	const editLease = (u) => {
		setModal('edit')
		setLease(u)
		handleShow(true)
	}
	
	const createLease = () => {
		setModal('new')
		handleShow(true)
	}
	
	const LeaseModal = function (){
		if(lease){
			return (
				modal==='view' ? <ViewLease lease={lease} onHide={handleClose} show={show} editLease={editLease} /> : null
			)
		}
		else return null
	}
	
	const EditModal = function (){
		if(lease){
			if(lease.property.address===null){
				lease.property.address = {
					addressLine1: '', addressLine2: '', city: '', country: '', postcode: ''
				}
			}
			return (
				modal==='edit' ? <EditLease lease={lease} onHide={handleClose} show={show} updateLease={onUpdateLease} leaseOptions={leaseOptions} /> : null
			)
		}
		else return null
	}
	
	const CreateLeaseModal = () => {
		return modal==='new' ? <CreateLease onHide={handleClose} show={show} leaseOptions={leaseOptions} onRefresh={()=>reloadPage()} /> : null
	}
	
	const LeaseRow = (props) => {
		const lease = props.lease
		return(
			<tr>
				<td>
					<div className="d-flex align-items-center">
						<div>
							<input className="form-check-input me-3" type="checkbox" value="" aria-label="..." />
						</div>
						<div className="ms-2">
							<h6 className="mb-0 font-14">
								<NavLink to={'/leases/'+lease.id}>{lease.id.substr(0,8)}</NavLink>
							</h6>
						</div>
					</div>
				</td>
				<td>
					{lease.tenant?lease.tenant.firstName+' '+lease.tenant.lastName :
					<span className="bg-light-info p-1 d-inline-block rounded" onClick={() => editLease(lease)}>update to <br/>view tenant</span> }
				</td>
				{/*<td>{lease.description}</td>*/}
				<td>{lease.property.name}</td>
				<td>
					{lease.property.address.addressLine1 ? <p className="mb-0">{lease.property.address.addressLine1}</p> : null}
					{lease.property.address.addressLine2 ? <p className="mb-0">{lease.property.address.addressLine2}</p> : null}
					{lease.property.address.city || lease.property.address.country ?
						<p className="mb-0">{lease.property.address.city}{(lease.property.address.city && lease.property.address.country) && ',' } {lease.property.address.country}</p> : null}
				</td>
				<td>
					{lease.status}<br/>
					{lease.paymentSchedule.cycle==='DAY'?'DAI':lease.paymentSchedule.cycle}LY
				</td>
				<td><PaymentSchedule lease={lease} /></td>
				<td>
					<ShortDateString date={lease.startDate} />
				</td>
				<td>
					<ShortDateString date={lease.endDate} />
				</td>
				<td>
					<NavLink to={'/leases/'+lease.id} className="btn btn-primary btn-sm radius-30 px-4">View Details</NavLink>
				</td>
				<td>
					<div className="d-flex order-actions">
						<Button variant={'light'} className="btn-sm" title="Edit property" onClick={() => editLease(lease)}><i className='bx bxs-edit mx-0'/></Button>
						&nbsp;
						<Button variant={'light'} className="btn-sm" title="Delete property" onClick={() => deleteLease(lease)}><i className='bx bxs-trash mx-0'/></Button>
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
		//getLeases(event.selected)
	}
	
	const updatePageLimit = (l) => {
		setPageLimit(l)
		updateHistory("limit", l)
	}
	
	const tableHeader = [
		{ field: 'id', title: 'Lease #', sort: false },
		{ field: 'tenant', title: 'Tenant', sort: true},
		// { field: 'description', title: 'Description', sort: true},
		{ field: 'name', title: 'Property Name', sort: true},
		{ field: 'address', title: 'Address', sort: true},
		{ field: 'status', title: 'Status', sort: false},
		{ field: 'schedule', title: 'Payment Schedule', sort: false},
		{ field: 'startDate', title: 'Start Date', sort: true },
		{ field: 'endDate', title: 'End Date', sort: true },
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
			<Breadcrumbs category={'Lease Management'} title={'Leases'}>
				<button type={'button'} className="btn btn-primary radius-30 mt-2 mt-lg-0" onClick={createLease}>
					<i className="bx bxs-plus-square"/>Add New Lease
				</button>
			</Breadcrumbs>
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
							{items.map(lease => {
								return (
									<LeaseRow lease={lease} key={lease.id}/>
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
			
			<LeaseModal />
			<EditModal />
			<CreateLeaseModal />
		</React.Fragment>
	);
}

export default Lease;