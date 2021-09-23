import React from 'react';
// import 'simplebar/dist/simplebar.min.css';
import SimpleBar from "simplebar-react";
import MetisMenu from "@metismenu/react";
import {NavLink} from "react-router-dom";
const Sidebar = () => {
	return (
		<SimpleBar forceVisible="y"  autoHide={false} className="sidebar-wrapper">
			<div className="sidebar-header">
				<div>
					<img src={'/assets/images/logo-icon.png'} className="logo-icon" alt="logo icon"/>
				</div>
				<div>
					<h4 className="logo-text">
						<NavLink to={'/'}>AppAdmin</NavLink>
					</h4>
				</div>
				<div className="toggle-icon ms-auto"><i className='bx bx-first-page'/>
				</div>
			</div>
			<MetisMenu className="metismenu" id="menu">
				<li>
					<NavLink to="/" >
						<div className="parent-icon"><i className='bx bx-home'/></div>
						<div className="menu-title">Dashboard</div>
					</NavLink>
				</li>
				<li>
					<a href={'#!'} className="has-arrow">
						<div className="parent-icon"><i className='bx bx-user'/>
						</div>
						<div className="menu-title">User Management</div>
					</a>
					<ul>
						<li><NavLink to="/users"><i className="bx bx-right-arrow-alt"/>Users</NavLink>
						</li>
						<li><a href={'/app-chat-box.html'}><i className="bx bx-right-arrow-alt"/>Chat Box</a>
						</li>
						<li><a href={'/app-file-manager.html'}><i className="bx bx-right-arrow-alt"/>File Manager</a>
						</li>
						<li><a href={'/app-contact-list.html'}><i className="bx bx-right-arrow-alt"/>Contatcs</a>
						</li>
						<li><a href={'/app-to-do.html'}><i className="bx bx-right-arrow-alt"/>Todo List</a>
						</li>
						<li><a href={'/app-invoice.html'}><i className="bx bx-right-arrow-alt"/>Invoice</a>
						</li>
						<li><a href={'/app-fullcalender.html'}><i className="bx bx-right-arrow-alt"/>Calendar</a>
						</li>
					</ul>
				</li>
				<li>
					<a href={'#!'} className="has-arrow">
						<div className="parent-icon"><i className='bx bx-book-alt'/>
						</div>
						<div className="menu-title">Page Management</div>
					</a>
					<ul>
						<li><NavLink to="/pages"><i className="bx bx-right-arrow-alt"/>Pages</NavLink>
						</li>
						<li><a href={'/app-chat-box.html'}><i className="bx bx-right-arrow-alt"/>Articles</a>
						</li>
						<li><a href={'/app-file-manager.html'}><i className="bx bx-right-arrow-alt"/>File Manager</a>
						</li>
						<li><a href={'/app-contact-list.html'}><i className="bx bx-right-arrow-alt"/>Contatcs</a>
						</li>
						<li><a href={'/app-to-do.html'}><i className="bx bx-right-arrow-alt"/>Todo List</a>
						</li>
						<li><a href={'/app-invoice.html'}><i className="bx bx-right-arrow-alt"/>Invoice</a>
						</li>
						<li><a href={'/app-fullcalender.html'}><i className="bx bx-right-arrow-alt"/>Calendar</a>
						</li>
					</ul>
				</li>
				<li className="menu-label">UI Elements</li>
				<li>
					<a href={'widgets.html'}>
						<div className="parent-icon"><i className='bx bx-briefcase-alt-2'/>
						</div>
						<div className="menu-title">Widgets</div>
					</a>
				</li>
				<li>
					<a href="#!" className="has-arrow">
						<div className="parent-icon"><i className='bx bx-cart-alt'/>
						</div>
						<div className="menu-title">eCommerce</div>
					</a>
					<ul>
						<li><a href={'/ecommerce-products.html'}><i className="bx bx-right-arrow-alt"/>Products</a>
						</li>
						<li><a href={'/ecommerce-products-details.html'}><i className="bx bx-right-arrow-alt"/>Product
							Details</a>
						</li>
						<li><a href={'/ecommerce-add-new-products.html'}><i className="bx bx-right-arrow-alt"/>Add New
							Products</a>
						</li>
						<li><a href={'/ecommerce-orders.html'}><i className="bx bx-right-arrow-alt"/>Orders</a>
						</li>
					</ul>
				</li>
				<li>
					<a className="has-arrow" href="#!">
						<div className="parent-icon"><i className='bx bx-gift'/>
						</div>
						<div className="menu-title">Components</div>
					</a>
					<ul>
						<li><a href={'/component-alerts.html'}><i className="bx bx-right-arrow-alt"/>Alerts</a>
						</li>
						<li><a href={'/component-accordions.html'}><i className="bx bx-right-arrow-alt"/>Accordions</a>
						</li>
						<li><a href={'/component-badges.html'}><i className="bx bx-right-arrow-alt"/>Badges</a>
						</li>
						<li><a href={'/component-buttons.html'}><i className="bx bx-right-arrow-alt"/>Buttons</a>
						</li>
						<li><a href={'/component-cards.html'}><i className="bx bx-right-arrow-alt"/>Cards</a>
						</li>
						<li><a href={'/component-carousels.html'}><i className="bx bx-right-arrow-alt"/>Carousels</a>
						</li>
						<li><a href={'/component-list-groups.html'}><i className="bx bx-right-arrow-alt"/>List
							Groups</a>
						</li>
						<li><a href={'/component-media-object.html'}><i className="bx bx-right-arrow-alt"/>Media Objects</a>
						</li>
						<li><a href={'/component-modals.html'}><i className="bx bx-right-arrow-alt"/>Modals</a>
						</li>
						<li><a href={'/component-navs-tabs.html'}><i className="bx bx-right-arrow-alt"/>Navs & Tabs</a>
						</li>
						<li><a href={'/component-navbar.html'}><i className="bx bx-right-arrow-alt"/>Navbar</a>
						</li>
						<li><a href={'/component-paginations.html'}><i className="bx bx-right-arrow-alt"/>Pagination</a>
						</li>
						<li><a href={'/component-popovers-tooltips.html'}><i className="bx bx-right-arrow-alt"/>Popovers
							& Tooltips</a>
						</li>
						<li><a href={'/component-progress-bars.html'}><i className="bx bx-right-arrow-alt"/>Progress</a>
						</li>
						<li><a href={'/component-spinners.html'}><i className="bx bx-right-arrow-alt"/>Spinners</a>
						</li>
						<li><a href={'/component-notifications.html'}><i className="bx bx-right-arrow-alt"/>Notifications</a>
						</li>
						<li><a href={'/component-avatars-chips.html'}><i className="bx bx-right-arrow-alt"/>Avatars &
							Chips</a>
						</li>
					</ul>
				</li>
				<li>
					<a className="has-arrow" href="#!">
						<div className="parent-icon"><i className='bx bx-command'/>
						</div>
						<div className="menu-title">Content</div>
					</a>
					<ul>
						<li><a href={'/content-grid-system.html'}><i className="bx bx-right-arrow-alt"/>Grid System</a>
						</li>
						<li><a href={'/content-typography.html'}><i className="bx bx-right-arrow-alt"/>Typography</a>
						</li>
						<li><a href={'/content-text-utilities.html'}><i className="bx bx-right-arrow-alt"/>Text
							Utilities</a>
						</li>
					</ul>
				</li>
				<li>
					<a className="has-arrow" href="#!">
						<div className="parent-icon"><i className='bx bx-atom'/>
						</div>
						<div className="menu-title">Icons</div>
					</a>
					<ul>
						<li><a href={'/icons-line-icons.html'}><i className="bx bx-right-arrow-alt"/>Line Icons</a>
						</li>
						<li><a href={'/icons-boxicons.html'}><i className="bx bx-right-arrow-alt"/>Boxicons</a>
						</li>
						<li><a href={'/icons-feather-icons.html'}><i className="bx bx-right-arrow-alt"/>Feather
							Icons</a>
						</li>
					</ul>
				</li>
				<li className="menu-label">Forms & Tables</li>
				<li>
					<a className="has-arrow" href="#!">
						<div className="parent-icon"><i className='bx bx-hourglass'/>
						</div>
						<div className="menu-title">Forms</div>
					</a>
					<ul>
						<li><a href={'/form-elements.html'}><i className="bx bx-right-arrow-alt"/>Form Elements</a>
						</li>
						<li><a href={'/form-input-group.html'}><i className="bx bx-right-arrow-alt"/>Input Groups</a>
						</li>
						<li><a href={'/form-layouts.html'}><i className="bx bx-right-arrow-alt"/>Forms Layouts</a>
						</li>
						<li><a href={'/form-validations.html'}><i className="bx bx-right-arrow-alt"/>Form Validation</a>
						</li>
						<li><a href={'/form-wizard.html'}><i className="bx bx-right-arrow-alt"/>Form Wizard</a>
						</li>
						<li><a href={'/form-text-editor.html'}><i className="bx bx-right-arrow-alt"/>Text Editor</a>
						</li>
						<li><a href={'/form-file-upload.html'}><i className="bx bx-right-arrow-alt"/>File Upload</a>
						</li>
						<li><a href={'/form-date-time-pickes.html'}><i className="bx bx-right-arrow-alt"/>Date
							Pickers</a>
						</li>
						<li><a href={'/form-select2.html'}><i className="bx bx-right-arrow-alt"/>Select2</a>
						</li>
					</ul>
				</li>
				<li>
					<a className="has-arrow" href="#!">
						<div className="parent-icon"><i className="bx bx-grid-alt"/>
						</div>
						<div className="menu-title">Tables</div>
					</a>
					<ul>
						<li><a href={'/table-basic-table.html'}><i className="bx bx-right-arrow-alt"/>Basic Table</a>
						</li>
						<li><a href={'/table-datatable.html'}><i className="bx bx-right-arrow-alt"/>Data Table</a>
						</li>
					</ul>
				</li>
				<li className="menu-label">Pages</li>
				<li>
					<a className="has-arrow" href="#!">
						<div className="parent-icon"><i className='bx bx-lock-open-alt'/>
						</div>
						<div className="menu-title">Authentication</div>
					</a>
					<ul>
						<li><a href={'/authentication-signin.html'}><i
	className="bx bx-right-arrow-alt"/>Sign In</a>
						</li>
						<li><a href={'/authentication-signup.html'}><i
	className="bx bx-right-arrow-alt"/>Sign Up</a>
						</li>
						<li><a href={'/authentication-signin-with-header-footer.html'}><i
	className="bx bx-right-arrow-alt"/>Sign In with Header & Footer</a>
						</li>
						<li><a href={'/authentication-signup-with-header-footer.html'}><i
	className="bx bx-right-arrow-alt"/>Sign Up with Header & Footer</a>
						</li>
						<li><a href={'/authentication-forgot-password.html'}><i
	className="bx bx-right-arrow-alt"/>Forgot Password</a>
						</li>
						<li><a href={'/authentication-reset-password.html'}><i
	className="bx bx-right-arrow-alt"/>Reset Password</a>
						</li>
						<li><a href={'/authentication-lock-screen.html'}><i
	className="bx bx-right-arrow-alt"/>Lock Screen</a>
						</li>
					</ul>
				</li>
				<li>
					<a href={'/user-profile.html'}>
						<div className="parent-icon"><i className='bx bx-user-pin'/>
						</div>
						<div className="menu-title">User Profile</div>
					</a>
				</li>
				<li>
					<a href={'timeline.html'}>
						<div className="parent-icon"><i className="bx bx-video-recording"/>
						</div>
						<div className="menu-title">Timeline</div>
					</a>
				</li>
				<li>
					<a className="has-arrow" href="#!">
						<div className="parent-icon"><i className="bx bx-error"/>
						</div>
						<div className="menu-title">Errors</div>
					</a>
					<ul>
						<li><a href={'/errors-404-error.html'}><i className="bx bx-right-arrow-alt"/>404
							Error</a>
						</li>
						<li><a href={'/errors-500-error.html'}><i className="bx bx-right-arrow-alt"/>500
							Error</a>
						</li>
						<li><a href={'/errors-coming-soon.html'}><i className="bx bx-right-arrow-alt"/>Coming
							Soon</a>
						</li>
						<li><a href={'/error-blank-page.html'}><i className="bx bx-right-arrow-alt"/>Blank
							Page</a>
						</li>
					</ul>
				</li>
				<li>
					<a href={'faq.html'}>
						<div className="parent-icon"><i className="bx bx-help-circle"/>
						</div>
						<div className="menu-title">FAQ</div>
					</a>
				</li>
				<li>
					<a href={'/pricing-table.html'}>
						<div className="parent-icon"><i className='bx bx-dollar-circle'/>
						</div>
						<div className="menu-title">Pricing</div>
					</a>
				</li>
				<li className="menu-label">Charts & Maps</li>
				<li>
					<a className="has-arrow" href="#!">
						<div className="parent-icon"><i className="bx bx-line-chart"/>
						</div>
						<div className="menu-title">Charts</div>
					</a>
					<ul>
						<li><a href={'/charts-apex-chart.html'}><i className="bx bx-right-arrow-alt"/>Apex</a>
						</li>
						<li><a href={'/charts-chartjs.html'}><i className="bx bx-right-arrow-alt"/>Chartjs</a>
						</li>
						<li><a href={'/charts-highcharts.html'}><i className="bx bx-right-arrow-alt"/>Highcharts</a>
						</li>
					</ul>
				</li>
				<li>
					<a className="has-arrow" href="#!">
						<div className="parent-icon"><i className='bx bx-map-pin'/>
						</div>
						<div className="menu-title">Maps</div>
					</a>
					<ul>
						<li><a href={'/map-google-maps.html'}><i className="bx bx-right-arrow-alt"/>Google Maps</a>
						</li>
						<li><a href={'/map-vector-maps.html'}><i className="bx bx-right-arrow-alt"/>Vector Maps</a>
						</li>
					</ul>
				</li>
				<li className="menu-label">Others</li>
				<li>
					<a className="has-arrow" href="#!">
						<div className="parent-icon"><i className="bx bx-menu"/>
						</div>
						<div className="menu-title">Menu Levels</div>
					</a>
					<ul>
						<li><a className="has-arrow" href="#!"><i className="bx bx-right-arrow-alt"/>Level
							One</a>
							<ul>
								<li><a className="has-arrow" href="#!"><i
	className="bx bx-right-arrow-alt"/>Level Two</a>
									<ul>
										<li><a href="#!"><i className="bx bx-right-arrow-alt"/>Level Three</a>
										</li>
									</ul>
								</li>
							</ul>
						</li>
					</ul>
				</li>
				<li>
					<a href="https://codervent.com/synadmin/documentation/index.html" target="_blank" rel="noreferrer">
						<div className="parent-icon"><i className='bx bx-file'/>
						</div>
						<div className="menu-title">Documentation</div>
					</a>
				</li>
				<li>
					<a href="https://themeforest.net/user/codervent" target="_blank" rel="noreferrer">
						<div className="parent-icon"><i className='bx bx-headphone'/>
						</div>
						<div className="menu-title">Support</div>
					</a>
				</li>
			</MetisMenu>
		</SimpleBar>
	);
};

export default Sidebar;