import React from "react";
import {NavLink} from "react-router-dom";

const Home = () => {
	
	return(
		<div className="page-header-ui-content pt-5">
			<div className="container px-5">
				<div className="row gx-5 align-items-center">
					<div data-aos="fade-up" className="col-lg-6 aos-init aos-animate">
						<h1 className="page-header-ui-title">Automatically Bill, Record & Track your tenant payments</h1>
						<h6 className="page-header-ui-text mb-5">
							Need to check the payment history of a new tenant? Submit a request for the payment history and credit rating of a tenant before offering a lease</h6>
						<NavLink to={'/leases'} className="btn btn-lg btn-primary fw-500 me-3">Record Payment
							<i className="bx bx-right-arrow-alt" />
						</NavLink>
						<NavLink to={'/'} className="btn btn-lg btn-outline-info text-light fw-500">Request Payment History</NavLink>
					</div>
					<div data-aos="fade-up" data-aos-delay="50" className="col-lg-6 d-none d-lg-block aos-init aos-animate">
						<img src={"/assets/images/report.svg"} className="img-fluid"  alt="home"/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home