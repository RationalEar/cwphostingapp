import React from 'react';
import ReactPaginate from 'react-paginate';

function Pagination(props){
	const paginationProps = {
		className: "pagination justify-content-end", pageClassName: "page-item", pageLinkClassName: "page-link",
		previousClassName: "page-item", nextClassName: "page-item", previousLinkClassName: "page-link", nextLinkClassName: "page-link",
		activeClassName: "active", breakClassName: "page-item disabled", breakLinkClassName: "page-link"
	}
	//initialPage={props.pageCount>=props.pageOffset?props.pageOffset:0}
	console.log("Pagecount = "+props.pageCount+", PAGEoFFSET = "+props.pageOffset)
	return(
		<div className="row pt-4">
			<div className="col">
				<span>Showing {(props.pageOffset*props.pageLimit)+1} to {props.currentItems + (props.pageOffset*props.pageLimit)} of {props.totalItems} items </span>
				(Page {props.pageOffset+1} / {props.pageCount})
			</div>
			<div className="col">
				<ReactPaginate
					{...paginationProps}
					disableInitialCallback={true}
					breakLabel="..."
					nextLabel="Next"
					onPageChange={props.handlePageClick}
					pageRangeDisplayed={5}
					pageCount={props.pageCount}
					previousLabel="Previous"
					renderOnZeroPageCount={null}
					initialPage={(props.pageOffset*1)}
				/>
			</div>
		</div>
	)
}

export default Pagination
