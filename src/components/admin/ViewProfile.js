import React from "react";

function ViewProfile(props){
	const user = props.user
	
	return(
		<div className="card">
			<div className="card-body">
				<div className="d-flex flex-column align-items-center text-center">
					<img src={'/assets/images/avatars/user-purple-2.jpg'} alt="Admin" className="rounded-circle p-1 bg-primary" width="110" />
					<div className="mt-3">
						<h4>{user.firstName} {user.lastName}</h4>
						<p className="text-secondary mb-1">{user.email}</p>
						<p className="text-secondary mb-1">{user.phoneNumber}</p>
						<button className="btn btn-outline-primary" onClick={()=>props.setEdit('edit')}>
							<i className="bx bx-edit"/> Edit Account Details
						</button>
						&nbsp;&nbsp;&nbsp;
						<button className="btn btn-outline-primary" onClick={()=>props.setEdit('password')}><i className="bx bxs-key"/> Change Password</button>
					</div>
				</div>
				<hr className="my-4" />
				<ul className="list-group list-group-flush">
					<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
						<h6 className="mb-0">
							Address
						</h6>
						<span className="text-secondary">
													{user.address ? user.address.addressLine1 : ''}{user.address && user.address.addressLine2?', ':''}
							{user.address ? user.address.addressLine2 : ''} </span>
					</li>
					<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
						<h6 className="mb-0">
							City
						</h6>
						<span className="text-secondary">{user.address ? user.address.city : ''}</span>
					</li>
					<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
						<h6 className="mb-0">
							Country
						</h6>
						<span className="text-secondary">{user.address ? user.address.country : ''}</span>
					</li>
					<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
						<h6 className="mb-0">
							Created
						</h6>
						<span className="text-secondary">{user.created}</span>
					</li>
					<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
						<h6 className="mb-0">
							Last Login
						</h6>
						<span className="text-secondary">{user.lastLogin}</span>
					</li>
					<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
						<h6 className="mb-0">
							Roles
						</h6>
						<span className="text-secondary">{user.roles.map(role => role.alias).join(', ')}</span>
					</li>
					<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
						&nbsp;
					</li>
				</ul>
			</div>
		</div>
	)
}

export default ViewProfile