import React from 'react';
import {Link} from "react-router-dom";

function Breadcrumbs(props) {
	return (
		<div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
			<div className="breadcrumb-title pe-3">{props.category?props.category:'Dashboard'}</div>
			<div className="ps-3">
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb mb-0 p-0">
						<li className="breadcrumb-item">
							<Link to="/"><i className="bx bx-home-alt"/></Link>
						</li>
						<li className="breadcrumb-item active" aria-current="page">{props.title?props.title:'Dashboard'}</li>
					</ol>
				</nav>
			</div>
			<div className="ms-auto">
				<div className="btn-group">
					<button type="button" className="btn btn-primary">Settings</button>
					<button type="button"
							className="btn btn-primary split-bg-primary dropdown-toggle dropdown-toggle-split"
							data-bs-toggle="dropdown"><span className="visually-hidden">Toggle Dropdown</span>
					</button>
					<div className="dropdown-menu dropdown-menu-right dropdown-menu-lg-end">
						<a className="dropdown-item" href="#!">Action</a>
						<a className="dropdown-item" href="#!">Another action</a>
						<a className="dropdown-item" href="#!">Something else here</a>
						<div className="dropdown-divider"/>
						<a className="dropdown-item" href="#!">Separated link</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Breadcrumbs;