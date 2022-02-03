import React from 'react';

function ClientFooter() {
	const year = new Date().getFullYear()
	return (
		<div className="bg-white p-3 fixed-bottom border-top shadow">
			<div className="d-flex align-items-center justify-content-between flex-wrap">
				<ul className="list-inline mb-0">
					<li className="list-inline-item">Follow Us :</li>
					<li className="list-inline-item">
						<a href="https://facebook.com" rel="noreferrer" target="_blank"><i className='bx bxl-facebook me-1'/>Facebook</a>
					</li>
					<li className="list-inline-item">
						<a href="https://twitter.com" rel="noreferrer" target="_blank"><i className='bx bxl-twitter me-1'/>Twitter</a>
					</li>
				</ul>
				<p className="mb-0">Payments Tracker. Copyright &copy; 2021 - {year}. All rights reserved.</p>
			</div>
		</div>
	)
}

export default ClientFooter;