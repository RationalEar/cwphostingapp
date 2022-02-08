import React, {useCallback, useEffect, useState} from "react";
import {Button, Row, Spinner} from "react-bootstrap";
import PageLimit from "../../common/PageLimit";
import Pagination from "../../common/Pagination";
import {NavLink, useHistory} from "react-router-dom";
import {convertSort, get_axios_error, useQuery} from "../../../helpers/general";
import {useDispatch} from "react-redux";
import {setWarning} from "../../../features/notifications/NotificationSlice";
import {debounce} from "lodash";

function Search(props){
	
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
	
	const getUsers = useCallback((limit=false) => {
		setFetched(true)
		// const search = query.toString()
		let page = query.get("page")
		// console.log("Query String: ", search)
		
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
		else return;
		
		setLoading(true)
		window.axios.get('users/tenants', {params:params})
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
	
	
	useEffect(()=>{
		if(!fetched){
			getUsers()
		}
	}, [getUsers, fetched])
	
	const UserRow = (props) => {
		const user = props.user
		return(
			<tr>
				<td>
					<div className="d-flex align-items-center">
						{/*<div>*/}
						{/*	<input className="form-check-input me-3" type="checkbox" value="" aria-label="..." />*/}
						{/*</div>*/}
						<div className="ms-2">
							<h6 className="mb-0 font-14">{user.id.substr(0,6)}</h6>
						</div>
					</div>
				</td>
				<td>{user.firstName} {user.lastName}</td>
				<td>{user.email}</td>
				<td>
					<NavLink to={"/buy-report/"+user.id} role="button" className="btn btn-primary btn-sm" title="Select user" ><i className='bx bx-user-check mx-0'/> Select</NavLink>
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
		//getUsers(event.selected)
	}
	
	const updatePageLimit = (l) => {
		setPageLimit(l)
		updateHistory("limit", l)
	}
	
	const tableHeader = [
		{ field: 'id', title: 'User #', sort: false },
		{ field: 'name', title: 'Full Name', sort: true},
		{ field: 'email', title: 'Email Address', sort: true},
		{ field: 'actions', title: ' ', sort: false}
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
					<span className="cursor-pointer" title={'Click to sort by '+props.title} onClick={() => changeSort(props.field)}>
						{props.title} <i className={'fadeIn animated '+dir} />
					</span>
				)
			}
			else return (
				<span className="cursor-pointer" title={'Click to sort by '+props.title} onClick={() => changeSort(props.field)}>
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
		<div className="card">
			<div className="card-body">
				<Row className="align-items-center mb-4 gap-3">
					<div className="col">
						<div className="position-relative">
							<input type="search" className="form-control form-control-lg ps-5 radius-30" placeholder="Search by name/email"
								   onChange={handleSearchChange} onCancel={()=>setFilter(false)} defaultValue={filter} />
							<span className="position-absolute top-50 product-show translate-middle-y">
								<i className="bx bx-search"/>
							</span>
						</div>
					</div>
					<div className="col">
						<div className="d-lg-flex gap-3">
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
					</div>
				</Row>
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
						{items.map(user => {
							return (
								<UserRow user={user} key={user.id}/>
							)
						})}
						</tbody>
					</table>
					
					{!filter && items.length===0 && <div className="col-md-7 mx-auto my-5 text-center">
						<div className="rounded rounded-5 border border-1 p-5 fs-2">
							Start you order by searching for a user
						</div>
					</div>}
				
				</div>
				
				{pageCount>0?<Pagination
					handlePageClick={handlePageClick}
					pageCount={pageCount} pageLimit={pageLimit} pageOffset={pageOffset}
					totalItems={totalItems} currentItems={items.length}
				/>:null}
			</div>
		</div>
	)
}

export default Search