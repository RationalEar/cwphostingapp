import React from 'react';
import {Link} from "react-router-dom";

function NotFound(props) {
	return (
		<div className="error-404 d-flex align-items-center justify-content-center">
			<div className="container">
				<div className="card py-2">
					<div className="row g-0">
						<div className="col col-xl-5">
							<div className="card-body p-4">
								<h1 className="display-1"><span className="text-primary">4</span><span
									className="text-danger">0</span><span className="text-success">4</span></h1>
								<h2 className="font-weight-bold display-4">Page Not Found</h2>
								<p>You have reached the edge of the inter webs.
									<br />The page you requested could not be found.
										<br />Don't worry, you can return to the previous page.</p>
								<div className="mt-5">
									<Link to="/" className="btn btn-primary btn-lg px-md-5 radius-30">Go Home</Link>
									<button type="button" className="btn btn-outline-dark btn-lg ms-3 px-md-5 radius-30"
										onClick={()=>props.history.goBack()}>Back</button>
								</div>
							</div>
						</div>
						<div className="col-xl-7">
							<img src={'/assets/images/error-images/404-error.png'} className="img-fluid" alt="Page not found" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NotFound;