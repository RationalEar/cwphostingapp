import React from 'react';

function Footer() {
	const year = new Date().getFullYear()
	return (
		<footer className="page-footer">
			<p className="mb-0">Zimall Online Web Services. Copyright &copy; 2014 - {year}. All rights reserved.</p>
		</footer>
	);
}

export default Footer;