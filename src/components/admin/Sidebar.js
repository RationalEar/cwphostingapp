import React from 'react';
import SimpleBar from "simplebar-react";
import MetisMenu from "@metismenu/react";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {hoverClose, hoverOpen, manualToggle} from "../../features/General";
const Sidebar = () => {
	const dispatch = useDispatch()
	const general = useSelector((state)=>state.general)
	return (
		<SimpleBar forceVisible="y"  autoHide={false}className="sidebar-wrapper" onMouseEnter={()=>dispatch(hoverOpen())} onMouseLeave={()=>dispatch(hoverClose())} >
			<div className="sidebar-header">
				<div>
					<img src={'/assets/images/logo-icon.png'} className="logo-icon" alt="logo icon"/>
				</div>
				<div>
					<h4 className="logo-text">
						<NavLink to={'/admin'}>AppAdmin</NavLink>
					</h4>
				</div>
				<div className="toggle-icon ms-auto" onClick={()=>dispatch(manualToggle())}>
					<i className={general.manualToggled?'bx bx-last-page':'bx bx-first-page'}/>
				</div>
			</div>
			<MetisMenu className="metismenu" id="menu">
				<li>
					<NavLink to="/admin" >
						<div className="parent-icon"><i className='bx bx-home'/></div>
						<div className="menu-title">Dashboard</div>
					</NavLink>
				</li>
				<li>
					<NavLink to="/admin/orders" >
						<div className="parent-icon"><i className='bx bx-archive-in'/></div>
						<div className="menu-title">Orders</div>
					</NavLink>
				</li>
				<li>
					<NavLink to="/admin/leases" >
						<div className="parent-icon"><i className='bx bxs-file'/></div>
						<div className="menu-title">Leases</div>
					</NavLink>
				</li>
				<li>
					<NavLink to="/admin/properties" >
						<div className="parent-icon"><i className='bx bx-building-house'/></div>
						<div className="menu-title">Properties</div>
					</NavLink>
				</li>
				{/*<li>
					<a href={'#!'} className="has-arrow">
						<div className="parent-icon"><i className='bx bx-building-house'/>
						</div>
						<div className="menu-title">Property Management</div>
					</a>
					<ul>
						<li><NavLink to="/leases"><i className="bx bx-right-arrow-alt"/>Leases</NavLink></li>
						<li><NavLink to="/properties"><i className="bx bx-right-arrow-alt"/>Properties</NavLink></li>
					</ul>
				</li>*/}
				<li>
					<a href={'/admin/users'} className="has-arrow">
						<div className="parent-icon"><i className='bx bx-user'/></div>
						<div className="menu-title">User Management</div>
					</a>
					<ul>
						<li><NavLink to="/admin/users"><i className="bx bx-right-arrow-alt"/>Users</NavLink></li>
						<li><NavLink to="/admin/roles"><i className="bx bx-right-arrow-alt"/>Roles</NavLink></li>
						<li><NavLink to="/profile"><i className="bx bx-right-arrow-alt"/>My Profile</NavLink></li>
						
					</ul>
				</li>
			</MetisMenu>
		</SimpleBar>
	);
};

export default Sidebar;