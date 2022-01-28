import React from 'react';
import {NavLink} from "react-router-dom";

function Breadcrumbs(props) {
	const links = props.links ? props.links : []
	return (
		<div className="page-breadcrumb d-flex d-sm-flex align-items-center mb-3">
			<div className="breadcrumb-title pe-3 d-none d-sm-flex">{props.category?props.category:'Dashboard'}</div>
			<div className="ps-3 d-none d-sm-flex">
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb mb-0 p-0">
						<li className="breadcrumb-item">
							<NavLink to="/"><i className="bx bx-home-alt"/></NavLink>
						</li>
						{links.map(link => {
							return(
								<li key={link.to} className="breadcrumb-item">
									<NavLink to={link.to}>{link.title}</NavLink>
								</li>
							)
						})}
						<li className="breadcrumb-item active" aria-current="page">{props.title?props.title:'Dashboard'}</li>
					</ol>
				</nav>
			</div>
			<div className="ms-auto">
					{props.children}
					{/*<button type="button" className="btn btn-primary">Settings</button>
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
					</div>*/}
			</div>
		</div>
	);
}

export default Breadcrumbs;