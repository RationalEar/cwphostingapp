import React, {useCallback, useEffect, useState} from 'react';
import Breadcrumbs from "../../misc/Breadcrumbs";
import {debounce} from "lodash";
import Pagination from "../../common/Pagination";
import PageLimit from "../../common/PageLimit";
// import './Users.css'
import {Button, Spinner} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {setInfo, setWarning} from "../../../features/notifications/NotificationSlice";
import {convertSort, get_axios_error, useIsAdminPath, useQuery} from "../../../helpers/general";
import {NavLink, useHistory} from "react-router-dom";

function Orders() {
	const history = useHistory()
	const query = useQuery();
	const [items, setItems] = useState([])
	const [pageCount, setPageCount] = useState(0)
	const [pageLimit, setPageLimit] = useState(query.get('limit') || 10 )
	const [pageOffset, setPageOffset] = useState(query.get('page') || 0)
	const [totalItems, setTotalItems] = useState(0)
	const [sort, setSort] = useState(convertSort(query.get('sort')))
	const [filter, setFilter] = useState(query.get('filter') ||'')
	const [relevance, setRelevance] = useState(false)
	const [loading, setLoading] = useState(false)
	const [fetched, setFetched] = useState(false)
	
	const dispatch = useDispatch()
	
	const isAdmin = useIsAdminPath()
	
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
	
	const getOrders = useCallback((limit=false) => {
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
		window.axios.get('orders', {params:params})
			.then(response=>{
				setItems(response.data.items)
				setPageCount(response.data.totalPages)
				const currentPage = response.data.currentPage <= response.data.totalPages ? response.data.currentPage : 0
				setPageOffset(currentPage)
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
	
	const cancelOrder = (u) => {
		const yes = window.confirm('Are you sure you want to cancel the order for '+u.firstName+' '+u.lastName+'?')
		if(yes){
			window.axios.put('order/cancel', {params: {id: u.id}})
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
	
	const approveOrder = (order) => {
		const u = order.tenant || order.user
		const yes = window.confirm('Are you sure you want to approve the order for '+u.firstName+' '+u.lastName+'?')
		if(yes){
			window.axios.get('orders/'+order.id+'/approve')
				.then(response => {
					setFetched(false)
				})
				.catch(error => {
					console.log(error)
				})
		}
	}
	
	useEffect(()=>{
		if(!fetched){
			getOrders()
		}
	}, [getOrders, fetched])
	
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
		//getUsers(event.selected)
	}
	
	const updatePageLimit = (l) => {
		setPageLimit(l)
		updateHistory("limit", l)
	}
	
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
	
	const DateString = (props) => {
		let date = new Date(props.date)
		return (
			date.toLocaleString()
		)
	}
	
	const StatusPill = ({status}) => {
		if(status==='COMPLETE') return (
			<button type={'button'} className="btn badge rounded-pill text-success bg-light-success p-2 text-uppercase">
				<i className='bx bxs-circle me-1'/> Complete
			</button>
		)
		else if(status==='PROCESSING') return (
			<button type={'button'} className="btn badge rounded-pill text-info bg-light-info p-2 text-uppercase">
				<i className='bx bxs-circle me-1'/> Processing
			</button>
		)
		else if(status==='ACTIVE') return (
			<button type={'button'} className="btn badge rounded-pill text-primary bg-light-primary p-2 text-uppercase">
				<i className='bx bxs-circle me-1'/> Active
			</button>
		)
		else if(status==='AWAITING_PAYMENT') return (
			<button type={'button'} className="btn badge rounded-pill text-warning bg-light-warning p-2 text-uppercase">
				<i className='bx bxs-circle me-1'/> Awaiting Payment
			</button>
		)
		if(['CANCELLED','FAILED'].includes(status)) return (
			<button type={'button'} className="btn badge rounded-pill text-danger bg-light-danger p-2 text-uppercase">
				<i className='bx bxs-circle me-1'/> {status}
			</button>
		)
		else return (
			<button type={'button'} className="btn badge rounded-pill text-light bg-secondary p-2 text-uppercase">
				<i className='bx bxs-circle me-1'/> {status}
			</button>
		)
	}
	
	const tableHeader = [
		{ field: 'id', title: 'Order #', sort: false },
		{ field: 'tenant', title: 'Tenant', sort: true},
		{ field: 'status', title: 'Status', sort: false},
		{ field: 'amount', title: 'Total', sort: false},
		{ field: 'created', title: 'Date Created', sort: true },
		{ field: 'details', title: 'View Details', sort: false},
		{ field: 'actions', title: 'Actions', sort: false}
	]
	
	const OrderRow = ({order}) => {
		return(
			<tr>
				<td>
					<div className="d-flex align-items-center">
						<div>
							<input className="form-check-input me-3" type="checkbox" value="" aria-label="..." />
						</div>
						<div className="ms-2">
							<h6 className="mb-0 font-14 text-uppercase">{order.id.substr(0,8)}</h6>
						</div>
					</div>
				</td>
				<td>
					{order.tenant ? <span>{order.tenant.firstName} {order.tenant.lastName}</span> : order.tenantId}
				</td>
				<td>
					<StatusPill status={order.status} />
				</td>
				<td>
					{order.currency} {Number(order.amount).toFixed(2)}
				</td>
				<td>
					<DateString date={order.created} />
				</td>
				<td>
					<NavLink to={'/orders/'+order.id} className="btn btn-primary btn-sm radius-30 px-4" >View Details</NavLink>
				</td>
				<td>
					<div className="d-flex order-actions">
						{isAdmin && order.status==='PROCESSING' ? <Button variant={'info'} size="sm" title="Approve Order" onClick={() => approveOrder(order)}>
							<i className='bx bx-check mx-0'/>
						</Button> : (isAdmin ? <Button variant={'primary'} className="btn-sm disabled" title="Approve Order"><i className='bx bx-check mx-0'/></Button>:null)}
						<Button variant={'light'} className="btn-sm" title="Cancel Order" onClick={() => cancelOrder(order.tenant)}><i className='bx bx-x mx-0'/></Button>
					</div>
				</td>
			</tr>
		)
	}
	
	return (
		<React.Fragment>
			<Breadcrumbs category={'Orders'} title={isAdmin?'Orders':'My Orders'} />
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
							{items.map(order => {
								return (
									<OrderRow order={order} key={order.id}/>
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
		</React.Fragment>
	);
}

export default Orders;